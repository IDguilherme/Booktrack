<script setup lang="ts">
import { ref, onMounted } from 'vue'

import PageHeader from '../components/layout/PageHeader.vue'
import GraficoBarras from '../components/relatorios/GraficoBarras.vue'
import { LivroService, DIAS_PRAZO_EMPRESTIMO, type EmprestimoAtivo, type LivroMaisEmprestado } from '../services/livros/LivroService'
import { HistoricoService } from '../services/historico/HistoricoService'
import type { HistoricoEmprestimo } from '../models/HistoricoEmprestimo'
import { useToast } from '../composables/useToast'

const toast = useToast()

const emprestimos = ref<EmprestimoAtivo[]>([])
const historico = ref<HistoricoEmprestimo[]>([])
const maisEmprestados = ref<LivroMaisEmprestado[]>([])

async function carregarEmprestimos() {
  try {
    const [ativos, registros, ranking] = await Promise.all([
      LivroService.listarEmprestimosAtivos(),
      HistoricoService.listar(),
      LivroService.listarMaisEmprestados()
    ])

    emprestimos.value = ativos
    historico.value = registros.sort((a, b) => b.id - a.id)
    maisEmprestados.value = ranking
  } catch (erro) {
    toast.erro(erro instanceof Error ? erro.message : 'Erro ao carregar relatórios.')
  }
}

function formatarData(data: string) {
  return new Date(data).toLocaleDateString('pt-BR')
}

onMounted(() => {
  carregarEmprestimos()
})
</script>

<template>
  <div class="page">

    <PageHeader
      titulo="📑 Relatórios"
      :descricao="`Empréstimos ativos e atrasados (prazo padrão: ${DIAS_PRAZO_EMPRESTIMO} dias).`"
    />

    <section class="lista">

      <div class="cabecalho">
        <h2>📈 Livros Mais Emprestados</h2>
      </div>

      <GraficoBarras :dados="maisEmprestados" />

    </section>

    <section class="lista">

      <div class="cabecalho">
        <h2>Empréstimos Ativos</h2>
        <span>{{ emprestimos.length }} empréstimo(s)</span>
      </div>

      <div
        v-if="emprestimos.length"
        class="tabela-container"
      >

        <table>

          <thead>
            <tr>
              <th>Livro</th>
              <th>Aluno</th>
              <th>Data do Empréstimo</th>
              <th>Dias Emprestado</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="emprestimo in emprestimos"
              :key="emprestimo.id"
              :class="{ atrasado: emprestimo.atrasado }"
            >

              <td>{{ emprestimo.livroTitulo }}</td>
              <td>{{ emprestimo.aluno }}</td>
              <td>{{ formatarData(emprestimo.data) }}</td>
              <td>{{ emprestimo.diasEmprestado }}</td>

              <td>
                <span
                  class="status"
                  :class="emprestimo.atrasado ? 'status-atrasado' : 'status-ok'"
                >
                  {{ emprestimo.atrasado ? 'Atrasado' : 'Em dia' }}
                </span>
              </td>

            </tr>
          </tbody>

        </table>

      </div>

      <div
        v-else
        class="vazio"
      >
        <p>📑 Nenhum empréstimo ativo no momento.</p>
      </div>

    </section>

    <section class="lista">

      <div class="cabecalho">
        <h2>Histórico de Devoluções</h2>
        <span>{{ historico.length }} registro(s)</span>
      </div>

      <div
        v-if="historico.length"
        class="tabela-container"
      >

        <table>

          <thead>
            <tr>
              <th>Livro</th>
              <th>Aluno</th>
              <th>Data do Empréstimo</th>
              <th>Data da Devolução</th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="registro in historico"
              :key="registro.id"
            >
              <td>{{ registro.livroTitulo }}</td>
              <td>{{ registro.aluno }}</td>
              <td>{{ formatarData(registro.dataEmprestimo) }}</td>
              <td>{{ formatarData(registro.dataDevolucao) }}</td>
            </tr>
          </tbody>

        </table>

      </div>

      <div
        v-else
        class="vazio"
      >
        <p>📭 Nenhuma devolução registrada ainda.</p>
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

tr.atrasado {
  background: #fef2f2;
}

.status {
  display: inline-block;
  padding: 5px 12px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 600;
}

.status-ok {
  background: #dcfce7;
  color: #166534;
}

.status-atrasado {
  background: #fee2e2;
  color: #dc2626;
}

.vazio {
  text-align: center;
  padding: 40px 20px;
  color: #6b7280;
}
</style>
