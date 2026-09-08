<script setup lang="ts">
import { ref } from 'vue'
import type { Aluno } from '../models/Aluno'

import PageHeader from '../components/layout/PageHeader.vue'
import AlunosForm from '../components/alunos/AlunosForm.vue'
import AlunosTable from '../components/alunos/AlunosTable.vue'

const pesquisa = ref('')
const alunoEmEdicao = ref<Aluno | null>(null)
const tabelaRef = ref<InstanceType<typeof AlunosTable> | null>(null)

function editarAluno(aluno: Aluno) {
  alunoEmEdicao.value = aluno
}

function aoSalvar() {
  alunoEmEdicao.value = null
  tabelaRef.value?.recarregar()
}

function aoCancelar() {
  alunoEmEdicao.value = null
}
</script>

<template>
  <div class="page">

    <PageHeader
      titulo="👨‍🎓 Alunos"
      descricao="Gerencie os alunos cadastrados na biblioteca."
    />

    <AlunosForm
      :aluno-em-edicao="alunoEmEdicao"
      @salvo="aoSalvar"
      @cancelado="aoCancelar"
    />

    <div class="toolbar">
      <input
        v-model="pesquisa"
        type="text"
        placeholder="🔍 Pesquisar aluno pelo nome..."
      />
    </div>

    <AlunosTable
      ref="tabelaRef"
      :pesquisa="pesquisa"
      @editar="editarAluno"
    />

  </div>
</template>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.toolbar input {
  width: 100%;
  max-width: 450px;
  padding: 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 15px;
}
</style>
