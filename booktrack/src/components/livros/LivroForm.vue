<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import { LivroService, type NovoLivro } from '../../services/livros/LivroService'
import { useToast } from '../../composables/useToast'

const router = useRouter()
const toast = useToast()

const titulo = ref('')
const autor = ref('')
const categoria = ref('')
const ano = ref<number | null>(null)
const quantidade = ref<number | null>(null)
const salvando = ref(false)

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

async function salvarLivro() {
  if (!titulo.value || !autor.value || !categoria.value || !quantidade.value) {
    toast.erro('Preencha todos os campos obrigatórios.')
    return
  }

  const novoLivro: NovoLivro = {
    titulo: titulo.value,
    autor: autor.value,
    categoria: categoria.value,
    ano: ano.value || 0,
    quantidade: quantidade.value
  }

  salvando.value = true

  try {
    await LivroService.salvar(novoLivro)
    toast.sucesso('Livro cadastrado com sucesso!')
    router.push('/livros')
  } catch (erro) {
    toast.erro(erro instanceof Error ? erro.message : 'Erro ao cadastrar livro.')
  } finally {
    salvando.value = false
  }
}
</script>

<template>
  <form class="formulario" @submit.prevent="salvarLivro">

    <section class="grupo">

      <h2>Informações do Livro</h2>

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
        :disabled="salvando"
      >
        {{ salvando ? 'Salvando...' : 'Salvar Livro' }}
      </button>

    </div>

  </form>
</template>

<style scoped>
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
</style>