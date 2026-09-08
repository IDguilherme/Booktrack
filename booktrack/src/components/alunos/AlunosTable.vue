<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { Aluno } from '../../models/Aluno'
import { AlunoService } from '../../services/alunos/AlunoService'
import { useToast } from '../../composables/useToast'
import { useConfirm } from '../../composables/useConfirm'

const toast = useToast()
const { confirmar } = useConfirm()

defineProps<{
  pesquisa?: string
}>()

const emit = defineEmits<{
  editar: [aluno: Aluno]
}>()

const alunos = ref<Aluno[]>([])

async function carregarAlunos() {
  try {
    alunos.value = await AlunoService.listar()
  } catch (erro) {
    toast.erro(erro instanceof Error ? erro.message : 'Erro ao carregar alunos.')
  }
}

async function excluirAluno(id: number) {
  const confirmou = await confirmar('Deseja realmente excluir este aluno?')

  if (!confirmou) {
    return
  }

  try {
    await AlunoService.excluir(id)
    await carregarAlunos()
    toast.sucesso('Aluno excluído com sucesso.')
  } catch (erro) {
    toast.erro(erro instanceof Error ? erro.message : 'Erro ao excluir aluno.')
  }
}

defineExpose({
  recarregar: carregarAlunos
})

onMounted(() => {
  carregarAlunos()
})
</script>

<template>
  <section class="lista">

    <div class="cabecalho">
      <h2>Alunos Cadastrados</h2>

      <span>
        {{ alunos.length }} aluno(s)
      </span>
    </div>

    <div
      v-if="alunos.length"
      class="tabela-container"
    >

      <table>

        <thead>
          <tr>
            <th>Nome</th>
            <th>Matrícula</th>
            <th>Turma</th>
            <th>Ações</th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="aluno in alunos.filter(a =>
              !pesquisa || a.nome.toLowerCase().includes(pesquisa.toLowerCase())
            )"
            :key="aluno.id"
          >

            <td>{{ aluno.nome }}</td>
            <td>{{ aluno.matricula }}</td>
            <td>{{ aluno.turma }}</td>

            <td class="acoes">
              <div class="acoes-conteudo">

                <button
                  class="btn-editar"
                  @click="emit('editar', aluno)"
                >
                  Editar
                </button>

                <button
                  class="btn-excluir"
                  @click="excluirAluno(aluno.id)"
                >
                  Excluir
                </button>

              </div>
            </td>

          </tr>
        </tbody>

      </table>

    </div>

    <div
      v-else
      class="vazio"
    >
      <p>👨‍🎓 Nenhum aluno cadastrado.</p>
      <p>Use o formulário acima para cadastrar o primeiro.</p>
    </div>

  </section>
</template>

<style scoped>
.lista {
  background: white;
  border-radius: 12px;
  padding: 25px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
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

tr:hover {
  background: #f9fafb;
}

.acoes {
  text-align: center;
  min-width: 180px;
  width: 180px;
}

.acoes-conteudo {
  display: flex;
  justify-content: center;
  gap: 8px;
}

.acoes-conteudo button {
  border: none;
  padding: 7px 12px;
  border-radius: 6px;
  cursor: pointer;
  white-space: nowrap;
}

.btn-editar {
  background: #dbeafe;
  color: #1d4ed8;
}

.btn-excluir {
  background: #fee2e2;
  color: #dc2626;
}

.btn-editar:hover {
  background: #bfdbfe;
}

.btn-excluir:hover {
  background: #fecaca;
}

.vazio {
  text-align: center;
  padding: 40px 20px;
  color: #6b7280;
}
</style>
