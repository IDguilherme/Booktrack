const express = require('express')
const bcrypt = require('bcryptjs')

const db = require('../db/database')

const router = express.Router()

const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// GET /api/usuarios - lista os usuários (equipe) da escola logada
router.get('/', (req, res) => {
  const usuarios = db
    .prepare('SELECT id, nome, email FROM usuarios WHERE escola_id = ? ORDER BY nome')
    .all(req.escolaId)

  res.json(usuarios)
})

// POST /api/usuarios - adiciona um novo usuário à mesma escola do usuário logado
router.post('/', async (req, res) => {
  const { nome, email, senha } = req.body

  if (!nome?.trim() || !email?.trim() || !senha) {
    return res.status(400).json({ erro: 'Nome, e-mail e senha são obrigatórios.' })
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

  const resultado = db
    .prepare(`
      INSERT INTO usuarios (escola_id, nome, email, senha_hash)
      VALUES (?, ?, ?, ?)
    `)
    .run(req.escolaId, nome.trim(), email.trim().toLowerCase(), senhaHash)

  res.status(201).json({ id: resultado.lastInsertRowid })
})

// DELETE /api/usuarios/:id - remove um usuário da equipe (não permite remover a si mesmo)
router.delete('/:id', (req, res) => {
  if (Number(req.params.id) === req.usuarioId) {
    return res.status(400).json({ erro: 'Você não pode remover seu próprio usuário.' })
  }

  const resultado = db
    .prepare('DELETE FROM usuarios WHERE id = ? AND escola_id = ?')
    .run(req.params.id, req.escolaId)

  if (resultado.changes === 0) {
    return res.status(404).json({ erro: 'Usuário não encontrado.' })
  }

  res.json({ excluido: true })
})

module.exports = router
