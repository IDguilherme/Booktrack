<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import PageHeader from '../components/layout/PageHeader.vue'
import LivrosTable from '../components/livros/LivrosTable.vue'

const router = useRouter()

const pesquisa = ref('')

function novoLivro() {
  router.push('/livros/novo')
}
</script>

<template>
  <div class="page">

    <PageHeader
      titulo="📚 Livros"
      descricao="Gerencie todo o acervo da biblioteca."
    />

    <div class="toolbar">

      <input
        v-model="pesquisa"
        type="text"
        placeholder="🔍 Pesquisar livro pelo título..."
      />

      <button class="novo-btn" @click="novoLivro">
        + Novo Livro
      </button>

    </div>

    <LivrosTable
      :pesquisa="pesquisa"
    />

  </div>
</template>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
}

.toolbar input {
  flex: 1;
  max-width: 450px;
  padding: 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 15px;
}

.novo-btn {
  background: #2563eb;
  color: white;
  border: none;
  padding: 12px 18px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
}

.novo-btn:hover {
  background: #1d4ed8;
}
</style>