<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

import PageHeader from '../components/layout/PageHeader.vue'
import { DashboardService } from '../services/dashboard/DashboardService'
import { useToast } from '../composables/useToast'

const toast = useToast()

const totalLivros = ref(0)
const totalAlunos = ref(0)
const emprestimosAtivos = ref(0)
const emprestimosAtrasados = ref(0)
const carregando = ref(false)

async function carregarDados() {
  carregando.value = true

  try {
    const estatisticas = await DashboardService.buscar()

    totalLivros.value = estatisticas.totalLivros
    totalAlunos.value = estatisticas.totalAlunos
    emprestimosAtivos.value = estatisticas.emprestimosAtivos
    emprestimosAtrasados.value = estatisticas.emprestimosAtrasados
  } catch (erro) {
    toast.erro(erro instanceof Error ? erro.message : 'Erro ao carregar o dashboard.')
  } finally {
    carregando.value = false
  }
}

const temAtrasados = computed(() => emprestimosAtrasados.value > 0)

onMounted(() => {
  carregarDados()
})
</script>

<template>
  <div>

    <PageHeader
      titulo="📊 Dashboard"
      descricao="Visão geral da biblioteca escolar."
    />

    <section class="dashboard">

      <div class="card">
        <h2>Livros</h2>
        <p>{{ totalLivros }}</p>
      </div>

      <div class="card">
        <h2>Alunos</h2>
        <p>{{ totalAlunos }}</p>
      </div>

      <div class="card">
        <h2>Empréstimos</h2>
        <p>{{ emprestimosAtivos }}</p>
      </div>

      <div
        class="card"
        :class="{ alerta: temAtrasados }"
      >
        <h2>Atrasados</h2>
        <p>{{ emprestimosAtrasados }}</p>
      </div>

    </section>

  </div>
</template>

<style scoped>

.dashboard{
  display:grid;
  grid-template-columns:repeat(auto-fit,minmax(220px,1fr));
  gap:20px;
}

.card{
  background:white;
  border-radius:12px;
  padding:20px;
  text-align:center;
  box-shadow:0 2px 10px rgba(0,0,0,.1);
}

.card p{
  font-size:2rem;
  font-weight:bold;
}

.card.alerta p {
  color: #dc2626;
}

</style>
