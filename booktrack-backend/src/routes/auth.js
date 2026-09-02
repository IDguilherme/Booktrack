const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')

const db = require('../db/database')
const { JWT_SECRET } = require('../middlewares/autenticar')

const router = express.Router()

const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// URL do front-end, usada para montar o link de redefinição de senha.
// Ajuste aqui (ou via variável de ambiente FRONTEND_URL) se o front rodar em outro endereço.
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173'

// POST /api/auth/registrar-escola
// Cria uma nova escola e o usuário responsável por ela (bibliotecário/admin).
router.post('/registrar-escola', async (req, res) => {
  const { nomeEscola, municipio, nomeUsuario, email, senha } = req.body

  if (!nomeEscola?.trim() || !municipio?.trim() || !nomeUsuario?.trim() || !email?.trim() || !senha) {
    return res.status(400).json({ erro: 'Todos os campos são obrigatórios.' })
  }

  if (!REGEX_EMAIL.test(email.trim())) {
    return res.status(400).json({ erro: 'Informe um e-mail válido.' })
  }

  if (senha.length < 6) {
    return res.status(400).json({ erro: 'A senha deve ter pelo menos 6 caracteres.' })
  }

  const emailJaExiste = db
    .prepare('SELECT id FROM usuarios WHERE email = ?')
    .get(email.trim().toLowerCase())

  if (emailJaExiste) {
    return res.status(400).json({ erro: 'Já existe um usuário com esse e-mail.' })
  }

  const senhaHash = await bcrypt.hash(senha, 10)

  const transacao = db.transaction(() => {
    const resultadoEscola = db
      .prepare('INSERT INTO escolas (nome, municipio) VALUES (?, ?)')
      .run(nomeEscola.trim(), municipio.trim())

    const escolaId = resultadoEscola.lastInsertRowid

    const resultadoUsuario = db
      .prepare(`
        INSERT INTO usuarios (escola_id, nome, email, senha_hash)
        VALUES (?, ?, ?, ?)
      `)
      .run(escolaId, nomeUsuario.trim(), email.trim().toLowerCase(), senhaHash)

    return { escolaId, usuarioId: resultadoUsuario.lastInsertRowid }
  })

  const { escolaId, usuarioId } = transacao()

  const token = jwt.sign({ escolaId, usuarioId }, JWT_SECRET, { expiresIn: '7d' })

  res.status(201).json({
    token,
    usuario: { id: usuarioId, nome: nomeUsuario.trim(), email: email.trim().toLowerCase() },
    escola: { id: escolaId, nome: nomeEscola.trim(), municipio: municipio.trim() }
  })
})

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, senha } = req.body

  if (!email?.trim() || !senha) {
    return res.status(400).json({ erro: 'Informe e-mail e senha.' })
  }

  const usuario = db
    .prepare('SELECT * FROM usuarios WHERE email = ?')
    .get(email.trim().toLowerCase())

  if (!usuario) {
    return res.status(401).json({ erro: 'E-mail ou senha inválidos.' })
  }

  const senhaCorreta = await bcrypt.compare(senha, usuario.senha_hash)

  if (!senhaCorreta) {
    return res.status(401).json({ erro: 'E-mail ou senha inválidos.' })
  }

  const escola = db
    .prepare('SELECT * FROM escolas WHERE id = ?')
    .get(usuario.escola_id)

  const token = jwt.sign(
    { escolaId: usuario.escola_id, usuarioId: usuario.id },
    JWT_SECRET,
    { expiresIn: '7d' }
  )

  res.json({
    token,
    usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email },
    escola: { id: escola.id, nome: escola.nome, municipio: escola.municipio }
  })
})

// POST /api/auth/esqueci-senha
// Por segurança, sempre retorna a mesma mensagem, exista ou não o e-mail informado.
router.post('/esqueci-senha', (req, res) => {
  const { email } = req.body

  if (!email?.trim()) {
    return res.status(400).json({ erro: 'Informe o e-mail.' })
  }

  const usuario = db
    .prepare('SELECT * FROM usuarios WHERE email = ?')
    .get(email.trim().toLowerCase())

  if (usuario) {
    const token = crypto.randomBytes(32).toString('hex')
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex')
    const expiraEm = Date.now() + 60 * 60 * 1000 // válido por 1 hora

    db.prepare('DELETE FROM password_resets WHERE usuario_id = ?').run(usuario.id)

    db.prepare(`
      INSERT INTO password_resets (usuario_id, token_hash, expira_em)
      VALUES (?, ?, ?)
    `).run(usuario.id, tokenHash, expiraEm)

    const linkReset = `${FRONTEND_URL}/redefinir-senha/${token}`

    // Ainda não há envio de e-mail configurado (precisaria de um serviço tipo
    // nodemailer + SMTP). Por enquanto, o link aparece aqui no console do
    // servidor - use-o para testar o fluxo manualmente.
    console.log(`\n📧 Link de redefinição de senha para ${usuario.email}:\n${linkReset}\n`)
  }

  res.json({
    mensagem: 'Se esse e-mail existir em nossa base, um link de redefinição foi gerado.'
  })
})

// POST /api/auth/redefinir-senha
router.post('/redefinir-senha', async (req, res) => {
  const { token, novaSenha } = req.body

  if (!token || !novaSenha) {
    return res.status(400).json({ erro: 'Dados inválidos.' })
  }

  if (novaSenha.length < 6) {
    return res.status(400).json({ erro: 'A senha deve ter pelo menos 6 caracteres.' })
  }

  const tokenHash = crypto.createHash('sha256').update(token).digest('hex')

  const registro = db
    .prepare('SELECT * FROM password_resets WHERE token_hash = ?')
    .get(tokenHash)

  if (!registro || registro.expira_em < Date.now()) {
    return res.status(400).json({ erro: 'Link inválido ou expirado. Solicite um novo.' })
  }

  const senhaHash = await bcrypt.hash(novaSenha, 10)

  db.prepare('UPDATE usuarios SET senha_hash = ? WHERE id = ?').run(senhaHash, registro.usuario_id)
  db.prepare('DELETE FROM password_resets WHERE id = ?').run(registro.id)

  res.json({ redefinida: true })
})

module.exports = router
