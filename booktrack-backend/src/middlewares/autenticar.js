const jwt = require('jsonwebtoken')

// Em produção, defina a variável de ambiente JWT_SECRET com um valor
// forte e secreto. Este valor abaixo é só um padrão para desenvolvimento.
const JWT_SECRET = process.env.JWT_SECRET || 'booktrack-segredo-de-desenvolvimento'

function autenticar(req, res, next) {
  const cabecalho = req.headers.authorization

  if (!cabecalho || !cabecalho.startsWith('Bearer ')) {
    return res.status(401).json({ erro: 'Não autenticado. Faça login novamente.' })
  }

  const token = cabecalho.replace('Bearer ', '')

  try {
    const dados = jwt.verify(token, JWT_SECRET)

    req.escolaId = dados.escolaId
    req.usuarioId = dados.usuarioId

    next()
  } catch (erro) {
    return res.status(401).json({ erro: 'Sessão expirada ou inválida. Faça login novamente.' })
  }
}

module.exports = autenticar
module.exports.JWT_SECRET = JWT_SECRET
