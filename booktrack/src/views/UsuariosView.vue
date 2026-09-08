<script setup lang="ts">
import { ref, onMounted } from 'vue'

import PageHeader from '../components/layout/PageHeader.vue'
import { UsuarioService, type UsuarioEquipe } from '../services/usuarios/UsuarioService'
import { AuthService } from '../services/auth/AuthService'
import { useToast } from '../composables/useToast'
import { useConfirm } from '../composables/useConfirm'

const toast = useToast()
const { confirmar } = useConfirm()

const sessao = AuthService.obterSessao()

const usuarios = ref<UsuarioEquipe[]>([])
const carregando = ref(false)

const nome = ref('')
const email = ref('')
const senha = ref('')
const salvando = ref(false)

async function carregarUsuarios() {
  carregando.value = true

  try {
    usuarios.value = await UsuarioService.listar()
  } catch (erro) {
    toast.erro(erro instanceof Error ? erro.message : 'Erro ao carregar usuários.')
  } finally {
    carregando.value = false
  }
}

async function adicionarUsuario() {
  if (!nome.value.trim() || !email.value.trim() || !senha.value.trim()) {
    toast.erro('Preencha todos os campos.')
    return
  }

  if (senha.value.length < 6) {
    toast.erro('A senha deve ter pelo menos 6 caracteres.')
    return
  }

  salvando.value = true

  try {
    await UsuarioService.salvar({
      nome: nome.value.trim(),
      email: email.value.trim(),
      senha: senha.value
    })

    nome.value = ''
    email.value = ''
    senha.value = ''

    toast.sucesso('Usuário adicionado com sucesso!')
    await carregarUsuarios()
  } catch (erro) {
    toast.erro(erro instanceof Error ? erro.message : 'Erro ao adicionar usuário.')
  } finally {
    salvando.value = false
  }
}

async function removerUsuario(usuario: UsuarioEquipe) {
  const confirmou = await confirmar(`Remover o acesso de ${usuario.nome}?`)

  if (!confirmou) {
    return
  }

  try {
    await UsuarioService.excluir(usuario.id)
    toast.sucesso('Usuário removido.')
    await carregarUsuarios()
  } catch (erro) {
    toast.erro(erro instanceof Error ? erro.message : 'Erro ao remover usuário.')
  }
}

onMounted(() => {
  carregarUsuarios()
})
</script>

<template>
  <div class="page">

    <PageHeader
      titulo="👥 Usuários"
      descricao="Gerencie quem tem acesso ao Booktrack na sua escola."
    />

    <section class="grupo">

      <h2>Adicionar Usuário</h2>

      <form
        class="formulario"
        @submit.prevent="adicionarUsuario"
      >

        <div class="linha">

          <div class="campo">
            <label>Nome</label>

            <input
              v-model="nome"
              type="text"
              placeholder="Ex.: João Pereira"
            />
          </div>

          <div class="campo">
            <label>E-mail</label>

            <input
              v-model="email"
              type="email"
              placeholder="joao@escola.com"
            />
          </div>

          <div class="campo">
            <label>Senha</label>

            <input
              v-model="senha"
              type="password"
              placeholder="Mínimo 6 caracteres"
            />
          </div>

        </div>

        <div class="acoes">
          <button
            type="submit"
            class="btn-primario"
            :disabled="salvando"
          >
            {{ salvando ? 'Adicionando...' : 'Adicionar' }}
          </button>
        </div>

      </form>

    </section>

    <section class="lista">

      <div class="cabecalho">
        <h2>Equipe da Escola</h2>
        <span>{{ usuarios.length }} usuário(s)</span>
      </div>

      <div
        v-if="usuarios.length"
        class="tabela-container"
      >

        <table>

          <thead>
            <tr>
              <th>Nome</th>
              <th>E-mail</th>
              <th>Ações</th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="usuario in usuarios"
              :key="usuario.id"
            >

              <td>
                {{ usuario.nome }}
                <span
                  v-if="usuario.id === sessao?.usuario.id"
                  class="voce"
                >
                  (você)
                </span>
              </td>

              <td>{{ usuario.email }}</td>

              <td class="acoes-tabela">
                <button
                  v-if="usuario.id !== sessao?.usuario.id"
                  class="btn-excluir"
                  @click="removerUsuario(usuario)"
                >
                  Remover
                </button>
              </td>

            </tr>
          </tbody>

        </table>

      </div>

      <div
        v-else
        class="vazio"
      >
        <p>👥 Nenhum outro usuário cadastrado ainda.</p>
      </div>

    </section>

  </div>
</template>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.grupo,
.lista {
  background: white;
  border-radius: 12px;
  padding: 25px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
}

.grupo h2 {
  margin-bottom: 20px;
  font-size: 20px;
}

.linha {
  display: grid;
  grid-template-columns: 2fr 2fr 1fr;
  gap: 20px;
}

.campo {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.campo label {
  font-weight: 600;
}

.campo input {
  padding: 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 15px;
}

.campo input:focus {
  outline: none;
  border-color: #2563eb;
}

.acoes {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}

.acoes button {
  padding: 12px 20px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-weight: 600;
}

.btn-primario {
  background: #2563eb;
  color: white;
}

.btn-primario:hover {
  background: #1d4ed8;
}

.btn-primario:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.cabecalho {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.cabecalho h2 {
  margin: 0;
}

.cabecalho span {
  color: #6b7280;
}

.tabela-container {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th {
  background: #f3f4f6;
  padding: 14px;
  font-size: 14px;
  text-align: left;
  white-space: nowrap;
  border: 1px solid #e5e7eb;
}

td {
  padding: 14px;
  vertical-align: middle;
  border: 1px solid #e5e7eb;
}

.voce {
  color: #6b7280;
  font-size: 13px;
}

.acoes-tabela {
  text-align: center;
  width: 120px;
}

.btn-excluir {
  border: none;
  padding: 7px 12px;
  border-radius: 6px;
  cursor: pointer;
  background: #fee2e2;
  color: #dc2626;
}

.btn-excluir:hover {
  background: #fecaca;
}

.vazio {
  text-align: center;
  padding: 30px 20px;
  color: #6b7280;
}

@media (max-width: 640px) {
  .linha {
    grid-template-columns: 1fr;
  }
}
</style>
