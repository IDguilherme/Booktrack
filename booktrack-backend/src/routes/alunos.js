const express = require('express')
const db = require('../db/database')

const router = express.Router()

// GET /api/alunos - lista todos os alunos da escola
router.get('/', (req, res) => {
  const alunos = db
    .prepare('SELECT * FROM alunos WHERE escola_id = ? ORDER BY nome')
    .all(req.escolaId)

  res.json(alunos)
})

// POST /api/alunos - cadastra um novo aluno
router.post('/', (req, res) => {
  const { nome, matricula, turma } = req.body

  if (!nome?.trim() || !matricula?.trim() || !turma?.trim()) {
    return res.status(400).json({ erro: 'Nome, matrícula e turma são obrigatórios.' })
  }

  const jaExiste = db
    .prepare('SELECT id FROM alunos WHERE matricula = ? AND escola_id = ?')
    .get(matricula.trim(), req.escolaId)

  if (jaExiste) {
    return res.status(400).json({ erro: 'Já existe um aluno com essa matrícula.' })
  }

  const resultado = db
    .prepare(`
      INSERT INTO alunos (escola_id, nome, matricula, turma)
      VALUES (?, ?, ?, ?)
    `)
    .run(req.escolaId, nome.trim(), matricula.trim(), turma.trim())

  res.status(201).json({ id: resultado.lastInsertRowid })
})

// PUT /api/alunos/:id - atualiza um aluno existente
router.put('/:id', (req, res) => {
  const { nome, matricula, turma } = req.body

  if (!nome?.trim() || !matricula?.trim() || !turma?.trim()) {
    return res.status(400).json({ erro: 'Nome, matrícula e turma são obrigatórios.' })
  }

  const duplicado = db
    .prepare('SELECT id FROM alunos WHERE matricula = ? AND escola_id = ? AND id != ?')
    .get(matricula, req.escolaId, req.params.id)

  if (duplicado) {
    return res.status(400).json({ erro: 'Já existe outro aluno com essa matrícula.' })
  }

  const resultado = db
    .prepare(`
      UPDATE alunos
      SET nome = ?, matricula = ?, turma = ?
      WHERE id = ? AND escola_id = ?
    `)
    .run(nome.trim(), matricula.trim(), turma.trim(), req.params.id, req.escolaId)

  if (resultado.changes === 0) {
    return res.status(404).json({ erro: 'Aluno não encontrado.' })
  }

  res.json({ atualizado: true })
})

// DELETE /api/alunos/:id - remove um aluno
router.delete('/:id', (req, res) => {
  const resultado = db
    .prepare('DELETE FROM alunos WHERE id = ? AND escola_id = ?')
    .run(req.params.id, req.escolaId)

  if (resultado.changes === 0) {
    return res.status(404).json({ erro: 'Aluno não encontrado.' })
  }

  res.json({ excluido: true })
})

module.exports = router
