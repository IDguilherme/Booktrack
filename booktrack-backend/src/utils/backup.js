const path = require('path')
const fs = require('fs')
const db = require('../db/database')

async function realizarBackup() {
  const pastaBackups = path.join(__dirname, '..', '..', 'backups')

  if (!fs.existsSync(pastaBackups)) {
    fs.mkdirSync(pastaBackups)
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
  const destino = path.join(pastaBackups, `booktrack-${timestamp}.db`)

  await db.backup(destino)

  limparBackupsAntigos(pastaBackups)

  return destino
}

// Mantém só os N backups mais recentes, para não encher o disco.
function limparBackupsAntigos(pasta, manter = 7) {
  const arquivos = fs
    .readdirSync(pasta)
    .filter(arquivo => arquivo.endsWith('.db'))
    .map(arquivo => ({
      nome: arquivo,
      tempo: fs.statSync(path.join(pasta, arquivo)).mtimeMs
    }))
    .sort((a, b) => b.tempo - a.tempo)

  arquivos.slice(manter).forEach(arquivo => {
    fs.unlinkSync(path.join(pasta, arquivo.nome))
  })
}

module.exports = { realizarBackup }
