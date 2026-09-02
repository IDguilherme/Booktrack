const Database = require('better-sqlite3')
const path = require('path')

const caminhoBanco = path.join(__dirname, '..', '..', 'booktrack.db')

const db = new Database(caminhoBanco)

db.pragma('journal_mode = WAL')
db.pragma('foreign_keys = ON')

function inicializar() {

  db.exec(`
    CREATE TABLE IF NOT EXISTS escolas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      municipio TEXT NOT NULL
    )
  `)

  db.exec(`
    CREATE TABLE IF NOT EXISTS livros (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      escola_id INTEGER NOT NULL DEFAULT 1,
      titulo TEXT NOT NULL,
      autor TEXT NOT NULL,
      categoria TEXT,
      ano INTEGER,
      quantidade INTEGER NOT NULL DEFAULT 1,
      FOREIGN KEY (escola_id) REFERENCES escolas(id)
    )
  `)

  db.exec(`
    CREATE TABLE IF NOT EXISTS alunos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      escola_id INTEGER NOT NULL DEFAULT 1,
      nome TEXT NOT NULL,
      matricula TEXT NOT NULL,
      turma TEXT,
      FOREIGN KEY (escola_id) REFERENCES escolas(id)
    )
  `)

  db.exec(`
    CREATE TABLE IF NOT EXISTS emprestimos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      escola_id INTEGER NOT NULL DEFAULT 1,
      livro_id INTEGER NOT NULL,
      aluno_nome TEXT NOT NULL,
      data_emprestimo TEXT NOT NULL,
      FOREIGN KEY (livro_id) REFERENCES livros(id) ON DELETE CASCADE,
      FOREIGN KEY (escola_id) REFERENCES escolas(id)
    )
  `)

  db.exec(`
    CREATE TABLE IF NOT EXISTS historico_emprestimos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      escola_id INTEGER NOT NULL DEFAULT 1,
      livro_id INTEGER NOT NULL,
      livro_titulo TEXT NOT NULL,
      aluno_nome TEXT NOT NULL,
      data_emprestimo TEXT NOT NULL,
      data_devolucao TEXT NOT NULL,
      FOREIGN KEY (escola_id) REFERENCES escolas(id)
    )
  `)

  db.exec(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      escola_id INTEGER NOT NULL,
      nome TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      senha_hash TEXT NOT NULL,
      FOREIGN KEY (escola_id) REFERENCES escolas(id)
    )
  `)

  const escolaPadrao = db
    .prepare('SELECT id FROM escolas WHERE id = 1')
    .get()

  if (!escolaPadrao) {
    db.prepare(
      'INSERT INTO escolas (id, nome, municipio) VALUES (1, ?, ?)'
    ).run('Escola Padrão', 'Município Padrão')
  }

  db.exec(`
    CREATE TABLE IF NOT EXISTS password_resets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      usuario_id INTEGER NOT NULL,
      token_hash TEXT NOT NULL UNIQUE,
      expira_em INTEGER NOT NULL,
      FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
    )
  `)

  const usuarioPadrao = db
    .prepare('SELECT id FROM usuarios WHERE escola_id = 1')
    .get()

  if (!usuarioPadrao) {
    const bcrypt = require('bcryptjs')
    const senhaHash = bcrypt.hashSync('admin123', 10)

    db.prepare(`
      INSERT INTO usuarios (escola_id, nome, email, senha_hash)
      VALUES (1, ?, ?, ?)
    `).run('Administrador', 'admin@escola.com', senhaHash)

    console.log('Usuário padrão criado -> e-mail: admin@escola.com | senha: admin123')
  }
}

inicializar()

module.exports = db
