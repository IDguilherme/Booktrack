<script setup lang="ts">
import { ref, watch } from 'vue'
import type { Aluno } from '../../models/Aluno'
import { AlunoService, type NovoAluno } from '../../services/alunos/AlunoService'
import { useToast } from '../../composables/useToast'

const toast = useToast()

const props = defineProps<{
  alunoEmEdicao?: Aluno | null
}>()

const emit = defineEmits<{
  salvo: []
  cancelado: []
}>()

const nome = ref('')
const matricula = ref('')
const turma = ref('')

function preencherFormulario(aluno: Aluno | null | undefined) {
  nome.value = aluno?.nome ?? ''
  matricula.value = aluno?.matricula ?? ''
  turma.value = aluno?.turma ?? ''
}

watch(
  () => props.alunoEmEdicao,
  aluno => preencherFormulario(aluno),
  { immediate: true }
)

function limparFormulario() {
  preencherFormulario(null)
}

async function salvarAluno() {
  if (!nome.value.trim() || !matricula.value.trim() || !turma.value.trim()) {
    toast.erro('Preencha todos os campos obrigatórios.')
    return
  }

  try {
    if (props.alunoEmEdicao) {
      const alunoAtualizado: Aluno = {
        ...props.alunoEmEdicao,
        nome: nome.value.trim(),
        matricula: matricula.value.trim(),
        turma: turma.value.trim()
      }

      await AlunoService.atualizar(alunoAtualizado)
      toast.sucesso('Aluno atualizado com sucesso!')
    } else {
      const novoAluno: NovoAluno = {
        nome: nome.value.trim(),
        matricula: matricula.value.trim(),
        turma: turma.value.trim()
      }

      await AlunoService.salvar(novoAluno)
      toast.sucesso('Aluno cadastrado com sucesso!')
    }

    limparFormulario()
    emit('salvo')
  } catch (erro) {
    toast.erro(erro instanceof Error ? erro.message : 'Erro ao salvar aluno.')
  }
}

function cancelar() {
  limparFormulario()
  emit('cancelado')
}
</script>

<template>
  <form class="formulario" @submit.prevent="salvarAluno">

    <section class="grupo">

      <h2>
        {{ alunoEmEdicao ? 'Editar Aluno' : 'Novo Aluno' }}
      </h2>

      <div class="linha">

        <div class="campo">
          <label>
            Nome <span>*</span>
          </label>

          <input
            v-model="nome"
            type="text"
            placeholder="Ex.: Maria Souza"
          />
        </div>

        <div class="campo">
          <label>
            Matrícula <span>*</span>
          </label>

          <input
            v-model="matricula"
            type="text"
            placeholder="Ex.: 2025001"
          />
        </div>

        <div class="campo">
          <label>
            Turma <span>*</span>
          </label>

          <input
            v-model="turma"
            type="text"
            placeholder="Ex.: 9º Ano A"
          />
        </div>

      </div>

    </section>

    <div class="acoes">

      <button
        v-if="alunoEmEdicao"
        type="button"
        class="btn-secundario"
        @click="cancelar"
      >
        Cancelar
      </button>

      <button
        type="submit"
        class="btn-primario"
      >
        {{ alunoEmEdicao ? 'Salvar Alterações' : 'Cadastrar Aluno' }}
      </button>

    </div>

  </form>
</template>

<style scoped>
.formulario {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.grupo {
  background: white;
  padding: 25px;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
}

.grupo h2 {
  margin-bottom: 20px;
  font-size: 20px;
}

.linha {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
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

.campo label span {
  color: #dc2626;
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
  gap: 12px;
}

.acoes button {
  padding: 12px 20px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-weight: 600;
}

.btn-secundario {
  background: #e5e7eb;
  color: #374151;
}

.btn-primario {
  background: #2563eb;
  color: white;
}

.btn-secundario:hover {
  background: #d1d5db;
}

.btn-primario:hover {
  background: #1d4ed8;
}

@media (max-width: 640px) {
  .linha {
    grid-template-columns: 1fr;
  }

  .acoes {
    flex-direction: column-reverse;
  }

  .acoes button {
    width: 100%;
  }
}

.btn-primario:hover {
  background: #1d4ed8;
}
</style>
