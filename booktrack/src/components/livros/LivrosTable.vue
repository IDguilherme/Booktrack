<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { Livro } from '../../models/Livro'
import { LivroService } from '../../services/livros/LivroService'
import { useToast } from '../../composables/useToast'
import { useConfirm } from '../../composables/useConfirm'

const toast = useToast()
const { confirmar } = useConfirm()

const livros = ref<Livro[]>([])
const carregando = ref(false)

const livroSelecionado = ref<number | null>(null)
const aluno = ref('')

async function carregarLivros() {
  carregando.value = true

  try {
    livros.value = await LivroService.listar()
  } catch (erro) {
    toast.erro(erro instanceof Error ? erro.message : 'Erro ao carregar livros.')
  } finally {
    carregando.value = false
  }
}

async function excluirLivro(id: number) {
  const confirmou = await confirmar('Deseja realmente excluir este livro?')

  if (!confirmou) {
    return
  }

  try {
    await LivroService.excluir(id)
    await carregarLivros()
    toast.sucesso('Livro excluído com sucesso.')
  } catch (erro) {
    toast.erro(erro instanceof Error ? erro.message : 'Erro ao excluir livro.')
  }
}

function iniciarEmprestimo(id: number) {
  livroSelecionado.value = id
  aluno.value = ''
}

function cancelarEmprestimo() {
  livroSelecionado.value = null
  aluno.value = ''
}

async function confirmarEmprestimo(livro: Livro) {
  if (!aluno.value.trim()) {
    toast.erro('Informe o nome do aluno.')
    return
  }

  if (livro.emprestimos.length >= livro.quantidade) {
    toast.erro('Não há exemplares disponíveis para empréstimo.')
    return
  }

  try {
    await LivroService.emprestar(livro.id, aluno.value.trim())
    cancelarEmprestimo()
    await carregarLivros()
    toast.sucesso('Empréstimo registrado com sucesso.')
  } catch (erro) {
    toast.erro(erro instanceof Error ? erro.message : 'Erro ao emprestar livro.')
  }
}

async function devolverLivro(livro: Livro, emprestimoId: number, alunoNome: string) {
  const confirmou = await confirmar(
    `Confirmar devolução do livro "${livro.titulo}" por ${alunoNome}?`
  )

  if (!confirmou) {
    return
  }

  try {
    await LivroService.devolver(livro.id, emprestimoId)
    await carregarLivros()
    toast.sucesso('Devolução registrada com sucesso.')
  } catch (erro) {
    toast.erro(erro instanceof Error ? erro.message : 'Erro ao devolver livro.')
  }
}

onMounted(() => {
  carregarLivros()
})
</script>

<template>
  <section class="lista">

    <div class="cabecalho">
      <h2>Livros Cadastrados</h2>

      <span>
        {{ livros.length }} livro(s)
      </span>
    </div>

    <div
      v-if="livros.length"
      class="tabela-container"
    >

      <table>

        <thead>
          <tr>
            <th>Título</th>
            <th>Autor</th>
            <th>Categoria</th>
            <th>Ano</th>
            <th>Quantidade</th>
            <th>Status</th>
            <th>Empréstimos</th>
            <th>Ações</th>
          </tr>
        </thead>

        <tbody>

          <template
            v-for="livro in livros"
            :key="livro.id"
          >

            <tr>

              <td>{{ livro.titulo }}</td>

              <td>{{ livro.autor }}</td>

              <td>{{ livro.categoria }}</td>

              <td>{{ livro.ano }}</td>

              <td>
                {{ livro.quantidade }}
              </td>

              <td>

                <span
                  v-if="livro.emprestimos.length < livro.quantidade"
                  class="status disponivel"
                >
                  {{ livro.quantidade - livro.emprestimos.length }}
                  disponível(is)
                </span>

                <span
                  v-else
                  class="status emprestado"
                >
                  Todos emprestados
                </span>

              </td>

              <td>

                <div
                  v-if="livro.emprestimos.length"
                  class="lista-emprestimos"
                >

                  <div
                    v-for="emprestimo in livro.emprestimos"
                    :key="emprestimo.id"
                    class="emprestimo"
                  >

                    <div>
                      <strong>{{ emprestimo.aluno }}</strong>

                      <small>
                        {{ emprestimo.data }}
                      </small>
                    </div>

                    <button
                      class="btn-devolver"
                      @click="devolverLivro(livro, emprestimo.id, emprestimo.aluno)"
                    >
                      Devolver
                    </button>

                  </div>

                </div>

                <span v-else>
                  Nenhum
                </span>

              </td>

              <!-- AÇÕES -->

              <td class="acoes">

                <div class="acoes-conteudo">

                  <button
                    v-if="livro.emprestimos.length < livro.quantidade"
                    class="btn-emprestar"
                    @click="iniciarEmprestimo(livro.id)"
                  >
                    Emprestar
                  </button>

                  <button
                    class="btn-editar"
                    @click="$router.push(`/livros/editar/${livro.id}`)"
                  >
                    Editar
                  </button>

                  <button
                    class="btn-excluir"
                    @click="excluirLivro(livro.id)"
                  >
                    Excluir
                  </button>

                </div>

              </td>

            </tr>

            <!-- Formulário de empréstimo -->

            <tr
              v-if="livroSelecionado === livro.id"
              class="linha-emprestimo"
            >

              <td colspan="8">

                <div class="form-emprestimo">

                  <label>
                    Nome do aluno
                  </label>

                  <input
                    v-model="aluno"
                    type="text"
                    placeholder="Ex.: João Silva"
                  />

                  <div class="acoes-emprestimo">

                    <button
                      class="btn-cancelar"
                      @click="cancelarEmprestimo"
                    >
                      Cancelar
                    </button>

                    <button
                      class="btn-confirmar"
                      @click="confirmarEmprestimo(livro)"
                    >
                      Confirmar Empréstimo
                    </button>

                  </div>

                </div>

              </td>

            </tr>

          </template>

        </tbody>

      </table>

    </div>

    <div
      v-else
      class="vazio"
    >

      <p>📚 Nenhum livro cadastrado.</p>

      <p>
        Clique em <strong>+ Novo Livro</strong>
        para cadastrar o primeiro.
      </p>

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
  table-layout: auto;
}

/* Cabeçalho */

th {
  background: #f3f4f6;
  padding: 14px;
  font-size: 14px;
  text-align: center;
  white-space: nowrap;
  border: 1px solid #e5e7eb;
}

/* Células */

td {
  padding: 14px;
  text-align: center;
  vertical-align: middle;
  border: 1px solid #e5e7eb;
}

tr:hover {
  background: #f9fafb;
}

/* Texto das informações principais */

th:nth-child(1),
td:nth-child(1),
th:nth-child(2),
td:nth-child(2),
th:nth-child(3),
td:nth-child(3) {
  text-align: left;
}

/* Quantidade */

th:nth-child(5),
td:nth-child(5) {
  min-width: 100px;
  text-align: center;
}

/* Status */

th:nth-child(6),
td:nth-child(6) {
  min-width: 150px;
  text-align: center;
}

/* Empréstimos */

th:nth-child(7),
td:nth-child(7) {
  min-width: 250px;
  text-align: center;
}

/* AÇÕES */

th:nth-child(8),
td:nth-child(8) {
  min-width: 270px;
  width: 270px;
  text-align: center;
}

/* Conteúdo dos botões */

.acoes-conteudo {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.acoes-conteudo button {
  border: none;
  padding: 7px 12px;
  border-radius: 6px;
  cursor: pointer;
  white-space: nowrap;
}

.btn-emprestar {
  background: #dcfce7;
  color: #166534;
}

.btn-devolver {
  background: #fef3c7;
  color: #92400e;
}

.btn-editar {
  background: #dbeafe;
  color: #1d4ed8;
}

.btn-excluir {
  background: #fee2e2;
  color: #dc2626;
}

.btn-emprestar:hover {
  background: #bbf7d0;
}

.btn-devolver:hover {
  background: #fde68a;
}

.btn-editar:hover {
  background: #bfdbfe;
}

.btn-excluir:hover {
  background: #fecaca;
}

/* Lista de empréstimos */

.lista-emprestimos {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.emprestimo {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.emprestimo div {
  display: flex;
  flex-direction: column;
  text-align: left;
}

.emprestimo small {
  color: #6b7280;
  font-size: 12px;
}

/* Formulário de empréstimo */

.linha-emprestimo {
  background: #f8fafc;
}

.form-emprestimo {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 10px;
}

.form-emprestimo label {
  font-weight: 600;
}

.form-emprestimo input {
  flex: 1;
  max-width: 350px;
  padding: 10px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
}

.acoes-emprestimo {
  display: flex;
  gap: 8px;
}

.acoes-emprestimo button {
  border: none;
  padding: 9px 14px;
  border-radius: 6px;
  cursor: pointer;
}

.btn-cancelar {
  background: #e5e7eb;
  color: #374151;
}

.btn-confirmar {
  background: #2563eb;
  color: white;
}

/* Mensagem quando não existem livros */

.vazio {
  text-align: center;
  padding: 40px 20px;
  color: #6b7280;
}
</style>


