const { realizarBackup } = require('../src/utils/backup')

realizarBackup()
  .then(destino => {
    console.log(`✅ Backup criado em: ${destino}`)
    process.exit(0)
  })
  .catch(erro => {
    console.error('❌ Erro ao criar backup:', erro)
    process.exit(1)
  })
