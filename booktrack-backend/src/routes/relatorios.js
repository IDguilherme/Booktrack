const express = require('express')
const db = require('../db/database')

const router = express.Router()

const DIAS_PRAZO_EMPRESTIMO = 30

// GET /api/relatorios/emprestimos-ativos
router.get('/emprestimos-ativos', (req, res) => {
  const linhas = db
    .prepare(`
      SELECT
        e.id,
        e.aluno_nome AS aluno,
        e.data_emprestimo AS data,
        l.id AS livro_id,
        l.titulo AS livro_titulo
      FROM emprestimos e
      JOIN livros l ON l.id = e.livro_id
      WHERE e.escola_id = ?
    `)
    .all(req.escolaId)

  const hoje = new Date()

  const emprestimos = linhas.map(linha => {
    const dataEmprestimo = new Date(linha.data)

    const diasEmprestado = Math.floor(
      (hoje.getTime() - dataEmprestimo.getTime()) / (1000 * 60 * 60 * 24)
    )

    return {
      id: linha.id,
      livroId: linha.livro_id,
      livroTitulo: linha.livro_titulo,
      aluno: linha.aluno,
      data: linha.data,
      diasEmprestado,
      atrasado: diasEmprestado > DIAS_PRAZO_EMPRESTIMO
    }
  })

  emprestimos.sort((a, b) => b.diasEmprestado - a.diasEmprestado)

  res.json(emprestimos)
})

// GET /api/relatorios/historico
router.get('/historico', (req, res) => {
  const historico = db
    .prepare(`
      SELECT
        id,
        livro_id AS livroId,
        livro_titulo AS livroTitulo,
        aluno_nome AS aluno,
        data_emprestimo AS dataEmprestimo,
        data_devolucao AS dataDevolucao
      FROM historico_emprestimos
      WHERE escola_id = ?
      ORDER BY id DESC
    `)
    .all(req.escolaId)

  res.json(historico)
})

// GET /api/relatorios/livros-mais-emprestados
// Junta empréstimos ativos + histórico para ranquear os livros mais emprestados/lidos
router.get('/livros-mais-emprestados', (req, res) => {
  const linhas = db
    .prepare(`
      SELECT livro_titulo AS titulo, COUNT(*) AS total FROM (
        SELECT l.titulo AS livro_titulo
        FROM emprestimos e
        JOIN livros l ON l.id = e.livro_id
        WHERE e.escola_id = ?

        UNION ALL

        SELECT livro_titulo
        FROM historico_emprestimos
        WHERE escola_id = ?
      )
      GROUP BY livro_titulo
      ORDER BY total DESC
      LIMIT 10
    `)
    .all(req.escolaId, req.escolaId)

  res.json(linhas)
})

module.exports = router
module.exports.DIAS_PRAZO_EMPRESTIMO = DIAS_PRAZO_EMPRESTIMO
