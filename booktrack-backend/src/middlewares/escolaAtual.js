// Por enquanto não existe autenticação, então toda a API opera com a
// escola padrão (id = 1). Quando o login for implementado, este
// middleware deve ler a escola do usuário autenticado (ex.: req.usuario.escolaId)
// em vez de usar um valor fixo.
function escolaAtual(req, res, next) {
  req.escolaId = 1
  next()
}

module.exports = escolaAtual
