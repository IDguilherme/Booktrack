# 📚 Booktrack

Sistema de biblioteca escolar — cadastro e empréstimo de livros para alunos. Projeto acadêmico pensado para uso em escolas de municípios.

## Estrutura do repositório

```
booktrack/            → Front-end (Vue 3 + TypeScript + Vite)
booktrack-backend/    → Back-end (Node + Express + SQLite)
```

Cada pasta tem seu próprio README com instruções específicas de instalação e execução.

## Como rodar o projeto completo

1. **Backend** (API):
   ```bash
   cd booktrack-backend
   npm install
   npm start
   ```
   Sobe em `http://localhost:3000`.

2. **Front-end** (interface):
   ```bash
   cd booktrack
   npm install
   npm run dev
   ```
   Sobe em `http://localhost:5173`.

3. Acesse `http://localhost:5173` no navegador. Use o login de teste criado automaticamente na primeira execução do backend:
   - **E-mail:** `admin@escola.com`
   - **Senha:** `admin123`

## Funcionalidades

- Cadastro, edição e exclusão de livros e alunos
- Empréstimo e devolução de livros, com histórico completo
- Relatórios: empréstimos ativos (com destaque de atraso), histórico de devoluções e gráfico dos livros mais emprestados
- Dashboard com indicadores gerais
- Autenticação por escola (JWT), com suporte a múltiplos usuários por escola
- Recuperação de senha
- Backup automático do banco de dados
- Interface responsiva (funciona em celular e tablet)

## Tecnologias

- **Front-end**: Vue 3, TypeScript, Vite, Vue Router
- **Back-end**: Node.js, Express, SQLite (`better-sqlite3`), JWT, bcrypt
