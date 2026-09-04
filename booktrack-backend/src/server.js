const express = require('express')
const cors = require('cors')
const cron = require('node-cron')

const autenticar = require('./middlewares/autenticar')
const { realizarBackup } = require('./utils/backup')

const authRoutes = require('./routes/auth')
const usuariosRoutes = require('./routes/usuarios')
const livrosRoutes = require('./routes/livros')
const alunosRoutes = require('./routes/alunos')
const relatoriosRoutes = require('./routes/relatorios')
const dashboardRoutes = require('./routes/dashboard')

const app = express()
const PORTA = process.env.PORT || 3000

// Em produção, defina CORS_ORIGIN com a URL do front-end (ex.: https://booktrack.vercel.app)
// para restringir quem pode chamar a API. Sem essa variável, libera qualquer origem.
app.use(cors({ origin: process.env.CORS_ORIGIN || true }))
app.use(express.json())

app.get('/', (req, res) => {
  res.json({ mensagem: 'API do Booktrack rodando 📚' })
})

// Rotas públicas (login, cadastro de escola e recuperação de senha)
app.use('/api/auth', authRoutes)

// A partir daqui, todas as rotas exigem autenticação
app.use('/api/usuarios', autenticar, usuariosRoutes)
app.use('/api/livros', autenticar, livrosRoutes)
app.use('/api/alunos', autenticar, alunosRoutes)
app.use('/api/relatorios', autenticar, relatoriosRoutes)
app.use('/api/dashboard', autenticar, dashboardRoutes)

app.use((req, res) => {
  res.status(404).json({ erro: 'Rota não encontrada.' })
})

// Backup automático do banco todo dia às 2h da manhã
cron.schedule('0 2 * * *', () => {
  realizarBackup()
    .then(destino => console.log(`🗄️  Backup automático criado: ${destino}`))
    .catch(erro => console.error('Erro no backup automático:', erro))
})

app.listen(PORTA, () => {
  console.log(`Booktrack API rodando em http://localhost:${PORTA}`)
})
