const express = require('express')
const db = require('../db/database')

const router = express.Router()

// GET /api/livros - lista todos os livros da escola, com os empréstimos ativos de cada um
router.get('/', (req, res) => {
  const livros = db
    .prepare('SELECT * FROM livros WHERE escola_id = ? ORDER BY titulo')
    .all(req.escolaId)

  const buscarEmprestimos = db.prepare(
    'SELECT id, aluno_nome AS aluno, data_emprestimo AS data FROM emprestimos WHERE livro_id = ?'
  )

  const livrosComEmprestimos = livros.map(livro => ({
    ...livro,
    emprestimos: buscarEmprestimos.all(livro.id)
  }))

  res.json(livrosComEmprestimos)
})

// POST /api/livros - cadastra um novo livro
router.post('/', (req, res) => {
  const { titulo, autor, categoria, ano, quantidade } = req.body

  if (!titulo?.trim() || !autor?.trim() || !quantidade) {
    return res.status(400).json({ erro: 'Título, autor e quantidade são obrigatórios.' })
  }

  if (!Number.isInteger(quantidade) || quantidade < 1) {
    return res.status(400).json({ erro: 'Quantidade deve ser um número inteiro maior que zero.' })
  }

  if (ano && (!Number.isInteger(ano) || ano < 0 || ano > new Date().getFullYear())) {
    return res.status(400).json({ erro: 'Ano inválido.' })
  }

  const resultado = db
    .prepare(`
      INSERT INTO livros (escola_id, titulo, autor, categoria, ano, quantidade)
      VALUES (?, ?, ?, ?, ?, ?)
    `)
    .run(req.escolaId, titulo.trim(), autor.trim(), categoria ?? null, ano ?? null, quantidade)

  res.status(201).json({ id: resultado.lastInsertRowid })
})

// PUT /api/livros/:id - atualiza um livro existente
router.put('/:id', (req, res) => {
  const { titulo, autor, categoria, ano, quantidade } = req.body

  if (!titulo?.trim() || !autor?.trim() || !quantidade) {
    return res.status(400).json({ erro: 'Título, autor e quantidade são obrigatórios.' })
  }

  if (!Number.isInteger(quantidade) || quantidade < 1) {
    return res.status(400).json({ erro: 'Quantidade deve ser um número inteiro maior que zero.' })
  }

  const resultado = db
    .prepare(`
      UPDATE livros
      SET titulo = ?, autor = ?, categoria = ?, ano = ?, quantidade = ?
      WHERE id = ? AND escola_id = ?
    `)
    .run(titulo.trim(), autor.trim(), categoria ?? null, ano ?? null, quantidade, req.params.id, req.escolaId)

  if (resultado.changes === 0) {
    return res.status(404).json({ erro: 'Livro não encontrado.' })
  }

  res.json({ atualizado: true })
})

// DELETE /api/livros/:id - remove um livro
router.delete('/:id', (req, res) => {
  const resultado = db
    .prepare('DELETE FROM livros WHERE id = ? AND escola_id = ?')
    .run(req.params.id, req.escolaId)

  if (resultado.changes === 0) {
    return res.status(404).json({ erro: 'Livro não encontrado.' })
  }

  res.json({ excluido: true })
})

// POST /api/livros/:id/emprestar - registra um novo empréstimo
router.post('/:id/emprestar', (req, res) => {
  const { aluno } = req.body

  if (!aluno || !aluno.trim()) {
    return res.status(400).json({ erro: 'Informe o nome do aluno.' })
  }

  const livro = db
    .prepare('SELECT * FROM livros WHERE id = ? AND escola_id = ?')
    .get(req.params.id, req.escolaId)

  if (!livro) {
    return res.status(404).json({ erro: 'Livro não encontrado.' })
  }

  const emprestimosAtivos = db
    .prepare('SELECT COUNT(*) AS total FROM emprestimos WHERE livro_id = ?')
    .get(livro.id).total

  if (emprestimosAtivos >= livro.quantidade) {
    return res.status(400).json({ erro: 'Não há exemplares disponíveis para empréstimo.' })
  }

  const dataEmprestimo = new Date().toISOString().split('T')[0]

  const resultado = db
    .prepare(`
      INSERT INTO emprestimos (escola_id, livro_id, aluno_nome, data_emprestimo)
      VALUES (?, ?, ?, ?)
    `)
    .run(req.escolaId, livro.id, aluno.trim(), dataEmprestimo)

  res.status(201).json({ id: resultado.lastInsertRowid })
})

// POST /api/livros/:id/devolver/:emprestimoId - devolve um livro e registra o histórico
router.post('/:id/devolver/:emprestimoId', (req, res) => {
  const emprestimo = db
    .prepare('SELECT * FROM emprestimos WHERE id = ? AND livro_id = ? AND escola_id = ?')
    .get(req.params.emprestimoId, req.params.id, req.escolaId)

  if (!emprestimo) {
    return res.status(404).json({ erro: 'Empréstimo não encontrado.' })
  }

  const livro = db
    .prepare('SELECT titulo FROM livros WHERE id = ?')
    .get(emprestimo.livro_id)

  const dataDevolucao = new Date().toISOString().split('T')[0]

  const transacao = db.transaction(() => {
    db.prepare(`
      INSERT INTO historico_emprestimos
        (escola_id, livro_id, livro_titulo, aluno_nome, data_emprestimo, data_devolucao)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(
      req.escolaId,
      emprestimo.livro_id,
      livro.titulo,
      emprestimo.aluno_nome,
      emprestimo.data_emprestimo,
      dataDevolucao
    )

    db.prepare('DELETE FROM emprestimos WHERE id = ?').run(emprestimo.id)
  })

  transacao()

  res.json({ devolvido: true })
})

module.exports = router
