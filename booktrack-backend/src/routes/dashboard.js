const express = require('express')
const db = require('../db/database')

const router = express.Router()

const DIAS_PRAZO_EMPRESTIMO = 30

// GET /api/dashboard - contadores gerais para a tela inicial
router.get('/', (req, res) => {
  const totalLivros = db
    .prepare('SELECT COUNT(*) AS total FROM livros WHERE escola_id = ?')
    .get(req.escolaId).total

  const totalAlunos = db
    .prepare('SELECT COUNT(*) AS total FROM alunos WHERE escola_id = ?')
    .get(req.escolaId).total

  const emprestimos = db
    .prepare('SELECT data_emprestimo FROM emprestimos WHERE escola_id = ?')
    .all(req.escolaId)

  const hoje = new Date()

  const atrasados = emprestimos.filter(emprestimo => {
    const dataEmprestimo = new Date(emprestimo.data_emprestimo)

    const dias = Math.floor(
      (hoje.getTime() - dataEmprestimo.getTime()) / (1000 * 60 * 60 * 24)
    )

    return dias > DIAS_PRAZO_EMPRESTIMO
  }).length

  res.json({
    totalLivros,
    totalAlunos,
    emprestimosAtivos: emprestimos.length,
    emprestimosAtrasados: atrasados
  })
})

module.exports = router
