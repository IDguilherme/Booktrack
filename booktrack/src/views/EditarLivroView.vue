<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import type { Livro } from '../models/Livro'
import { LivroService } from '../services/livros/LivroService'
import { API_BASE } from '../services/api'
import { useToast } from '../composables/useToast'

const route = useRoute()
const router = useRouter()
const toast = useToast()

const titulo = ref('')
const autor = ref('')
const categoria = ref('')
const ano = ref<number | null>(null)
const quantidade = ref<number | null>(null)

const arquivoCapa = ref<File | null>(null)
const previewCapa = ref<string | null>(null)
const capaAtualUrl = ref<string | null>(null)

const categorias = [
  'Literatura',
  'Romance',
  'Ficção',
  'Aventura',
  'Fantasia',
  'História',
  'Ciência',
  'Biografia',
  'Infantil',
  'Outro'
]

let livroOriginal: Livro | undefined

function selecionarCapa(evento: Event) {
  const input = evento.target as HTMLInputElement
  const arquivo = input.files?.[0]

  if (!arquivo) {
    return
  }

  if (!['image/jpeg', 'image/png', 'image/webp'].includes(arquivo.type)) {
    toast.erro('Use uma imagem JPG, PNG ou WEBP.')
    return
  }

  if (arquivo.size > 5 * 1024 * 1024) {
    toast.erro('A imagem deve ter no máximo 5MB.')
    return
  }

  arquivoCapa.value = arquivo
  previewCapa.value = URL.createObjectURL(arquivo)
}

onMounted(async () => {
  const id = Number(route.params.id)

  try {
    livroOriginal = await LivroService.buscarPorId(id)
  } catch (erro) {
    toast.erro(erro instanceof Error ? erro.message : 'Erro ao buscar livro.')
    router.push('/livros')
    return
  }

  if (!livroOriginal) {
    toast.erro('Livro não encontrado.')
    router.push('/livros')
    return
  }

  titulo.value = livroOriginal.titulo
  autor.value = livroOriginal.autor
  categoria.value = livroOriginal.categoria
  ano.value = livroOriginal.ano
  quantidade.value = livroOriginal.quantidade

  if (livroOriginal.capaUrl) {
    capaAtualUrl.value = `${API_BASE}${livroOriginal.capaUrl}`
  }
})

async function atualizarLivro() {
  if (!livroOriginal) {
    return
  }

  if (
    !titulo.value ||
    !autor.value ||
    !categoria.value ||
    !quantidade.value
  ) {
    toast.erro('Preencha todos os campos obrigatórios.')
    return
  }

  const livroAtualizado: Livro = {
    ...livroOriginal,
    titulo: titulo.value,
    autor: autor.value,
    categoria: categoria.value,
    ano: ano.value || 0,
    quantidade: quantidade.value
  }

  try {
    await LivroService.atualizar(livroAtualizado)

    if (arquivoCapa.value) {
      try {
        await LivroService.uploadCapa(livroOriginal.id, arquivoCapa.value)
      } catch (erroCapa) {
        toast.erro('Livro atualizado, mas a capa não pôde ser enviada.')
        router.push('/livros')
        return
      }
    }

    toast.sucesso('Livro atualizado com sucesso!')
    router.push('/livros')
  } catch (erro) {
    toast.erro(erro instanceof Error ? erro.message : 'Erro ao atualizar livro.')
  }
}
</script>

<template>
  <div class="page">

    <header class="cabecalho">
      <h1>✏️ Editar Livro</h1>
      <p>Atualize as informações do livro.</p>
    </header>

    <form
      class="formulario"
      @submit.prevent="atualizarLivro"
    >

      <section class="grupo">

        <h2>Informações do Livro</h2>

        <div class="campo">
          <label>Capa do livro</label>

          <div class="upload-capa">

            <div class="preview-capa">
              <img
                v-if="previewCapa || capaAtualUrl"
                :src="previewCapa || capaAtualUrl!"
                alt="Capa do livro"
              />
              <span v-else>📕</span>
            </div>

            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              @change="selecionarCapa"
            />

          </div>
        </div>

        <div class="campo">
          <label>
            Título <span>*</span>
          </label>

          <input
            v-model="titulo"
            type="text"
            placeholder="Ex.: Dom Casmurro"
          />
        </div>

        <div class="campo">
          <label>
            Autor <span>*</span>
          </label>

          <input
            v-model="autor"
            type="text"
            placeholder="Ex.: Machado de Assis"
          />
        </div>

        <div class="campo">
          <label>
            Categoria <span>*</span>
          </label>

          <select v-model="categoria">

            <option disabled value="">
              Selecione uma categoria
            </option>

            <option
              v-for="item in categorias"
              :key="item"
              :value="item"
            >
              {{ item }}
            </option>

          </select>
        </div>

      </section>

      <section class="grupo">

        <h2>Informações do Acervo</h2>

        <div class="linha">

          <div class="campo">

            <label>Ano</label>

            <input
              v-model="ano"
              type="number"
              placeholder="2025"
            />

          </div>

          <div class="campo">

            <label>
              Quantidade <span>*</span>
            </label>

            <input
              v-model="quantidade"
              type="number"
              min="1"
              placeholder="Ex.: 5"
            />

          </div>

        </div>

      </section>

      <div class="acoes">

        <button
          type="button"
          class="btn-secundario"
          @click="router.push('/livros')"
        >
          Cancelar
        </button>

        <button
          type="submit"
          class="btn-primario"
        >
          Salvar Alterações
        </button>

      </div>

    </form>

  </div>
</template>

<style scoped>

.upload-capa {
  display: flex;
  align-items: center;
  gap: 16px;
}

.preview-capa {
  width: 70px;
  height: 95px;
  border-radius: 8px;
  background: #f3f4f6;
  border: 1px solid #d1d5db;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  flex-shrink: 0;
  font-size: 28px;
}

.preview-capa img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.upload-capa input[type="file"] {
  font-size: 14px;
}
.page {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.cabecalho h1 {
  margin-bottom: 5px;
}

.cabecalho p {
  color: #6b7280;
}

.formulario {
  display: flex;
  flex-direction: column;
  gap: 25px;
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

.campo {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 18px;
}

.campo label {
  font-weight: 600;
}

.campo label span {
  color: #dc2626;
}

.campo input,
.campo select {
  padding: 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 15px;
}

.campo input:focus,
.campo select:focus {
  outline: none;
  border-color: #2563eb;
}

.linha {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.acoes {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.acoes button {
  padding: 12px 20px;
  border: none;
  border-radius: 8px;
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
</style>