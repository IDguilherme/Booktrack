# Booktrack API

Backend do Booktrack — sistema de biblioteca escolar. Node + Express + SQLite (via `better-sqlite3`), com autenticação via JWT.

## Como rodar

```bash
npm install
npm start
```

O servidor sobe em `http://localhost:3000`. O banco `booktrack.db` é criado automaticamente na primeira execução, na raiz do projeto, junto com uma escola padrão e um usuário de acesso.

Para desenvolvimento com reinício automático ao salvar arquivos:

```bash
npm run dev
```

## Login padrão (dados de teste)

Na primeira execução, o sistema cria automaticamente uma escola padrão com um usuário de acesso:

- **E-mail:** `admin@escola.com`
- **Senha:** `admin123`

Use esse login para acessar os dados que você já tinha cadastrado antes da autenticação existir. Troque a senha depois, ou cadastre uma nova escola pelo endpoint de registro.

## Estrutura

```
src/
  db/database.js              # conexão e criação das tabelas (cria escola e usuário padrão na 1ª execução)
  middlewares/autenticar.js    # valida o token JWT e define escola_id/usuarioId da requisição
  routes/
    auth.js                    # login e cadastro de escola (rotas públicas)
    livros.js                  # CRUD de livros + emprestar/devolver
    alunos.js                  # CRUD de alunos
    relatorios.js              # empréstimos ativos + histórico
    dashboard.js                # contadores gerais
  server.js
```

## Endpoints

| Método | Rota                                    | Autenticação | Descrição                          |
|--------|------------------------------------------|--------------|--------------------------------------|
| POST   | `/api/auth/registrar-escola`             | Não          | Cria escola + usuário responsável   |
| POST   | `/api/auth/login`                        | Não          | Login (retorna token JWT)           |
| GET    | `/api/livros`                            | Sim          | Lista livros (com empréstimos)      |
| POST   | `/api/livros`                            | Sim          | Cadastra livro                      |
| PUT    | `/api/livros/:id`                        | Sim          | Atualiza livro                      |
| DELETE | `/api/livros/:id`                        | Sim          | Remove livro                        |
| POST   | `/api/livros/:id/emprestar`              | Sim          | Empresta (`{ aluno: string }`)      |
| POST   | `/api/livros/:id/devolver/:emprestimoId` | Sim          | Devolve e registra no histórico     |
| GET    | `/api/alunos`                            | Sim          | Lista alunos                        |
| POST   | `/api/alunos`                            | Sim          | Cadastra aluno                      |
| PUT    | `/api/alunos/:id`                        | Sim          | Atualiza aluno                      |
| DELETE | `/api/alunos/:id`                        | Sim          | Remove aluno                        |
| GET    | `/api/relatorios/emprestimos-ativos`     | Sim          | Empréstimos ativos + status atraso  |
| GET    | `/api/relatorios/historico`              | Sim          | Histórico de devoluções             |
| GET    | `/api/dashboard`                         | Sim          | Contadores gerais                   |

Rotas autenticadas exigem o cabeçalho `Authorization: Bearer <token>` recebido no login.

## Multi-tenant (várias escolas)

Toda tabela tem uma coluna `escola_id`. O middleware `autenticar` lê essa informação do token JWT gerado no login — cada escola só enxerga seus próprios dados automaticamente, sem precisar de nenhum filtro manual no front-end.

## Próximos passos sugeridos

1. Trocar a senha padrão (`admin123`) ou cadastrar uma escola nova antes de usar em produção
2. Definir a variável de ambiente `JWT_SECRET` com um valor forte antes de colocar em produção (hoje usa um valor padrão de desenvolvimento)
3. Deploy: como é SQLite, o arquivo `booktrack.db` fica no próprio servidor — para múltiplas escolas em produção, considerar migrar para PostgreSQL se o volume crescer

## Múltiplos usuários por escola

Cada escola pode ter vários usuários com acesso ao sistema. Quem já está logado pode adicionar novos usuários à mesma escola:

| Método | Rota             | Autenticação | Descrição                              |
|--------|-------------------|--------------|-------------------------------------------|
| GET    | `/api/usuarios`   | Sim          | Lista os usuários da escola logada         |
| POST   | `/api/usuarios`   | Sim          | Adiciona um novo usuário à mesma escola    |
| DELETE | `/api/usuarios/:id` | Sim        | Remove um usuário (não é possível remover a si mesmo) |

## Recuperação de senha

| Método | Rota                       | Autenticação | Descrição                              |
|--------|-----------------------------|--------------|-------------------------------------------|
| POST   | `/api/auth/esqueci-senha`   | Não          | Gera um link de redefinição (válido por 1h) |
| POST   | `/api/auth/redefinir-senha` | Não          | Define uma nova senha usando o token do link |

⚠️ **Importante**: ainda não há envio de e-mail configurado. O link de redefinição aparece no **console do servidor** (`npm start`) quando alguém solicita a redefinição — use-o para testar o fluxo manualmente. Para produção, integre um serviço de e-mail (ex.: `nodemailer` + SMTP, ou uma API como SendGrid/Resend) no lugar do `console.log` em `src/routes/auth.js`.

Se o front-end rodar em um endereço diferente de `http://localhost:5173`, defina a variável de ambiente `FRONTEND_URL` para o link de redefinição apontar para o lugar certo.

## Backup do banco de dados

- **Automático**: a cada dia, às 2h da manhã, o servidor (`npm start`) cria uma cópia do banco na pasta `backups/`, mantendo sempre os 7 backups mais recentes (os mais antigos são apagados automaticamente).
- **Manual**: rode `npm run backup` a qualquer momento para gerar um backup imediatamente.

Os backups ficam em `backups/booktrack-<data>.db` — para restaurar, basta parar o servidor, substituir o `booktrack.db` da raiz pelo backup desejado (renomeando-o) e iniciar de novo.
