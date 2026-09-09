const path = require('path')
const fs = require('fs')

// Em produção, defina UPLOADS_DIR apontando para um volume persistente
// (ex.: /data/uploads no Railway, o mesmo volume usado pelo DB_PATH)
// para as capas dos livros não serem perdidas a cada novo deploy.
const uploadsDir = process.env.UPLOADS_DIR || path.join(__dirname, '..', '..', 'uploads')

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
}

module.exports = { uploadsDir }
