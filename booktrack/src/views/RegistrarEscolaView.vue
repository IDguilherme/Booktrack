<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import { AuthService } from '../services/auth/AuthService'

const router = useRouter()

const nomeEscola = ref('')
const municipio = ref('')
const nomeUsuario = ref('')
const email = ref('')
const senha = ref('')
const carregando = ref(false)
const erro = ref('')

async function registrar() {
  if (
    !nomeEscola.value.trim() ||
    !municipio.value.trim() ||
    !nomeUsuario.value.trim() ||
    !email.value.trim() ||
    !senha.value.trim()
  ) {
    erro.value = 'Preencha todos os campos.'
    return
  }

  if (senha.value.length < 6) {
    erro.value = 'A senha deve ter pelo menos 6 caracteres.'
    return
  }

  erro.value = ''
  carregando.value = true

  try {
    await AuthService.registrarEscola({
      nomeEscola: nomeEscola.value.trim(),
      municipio: municipio.value.trim(),
      nomeUsuario: nomeUsuario.value.trim(),
      email: email.value.trim(),
      senha: senha.value
    })

    router.push('/')
  } catch (e) {
    erro.value = e instanceof Error ? e.message : 'Erro ao cadastrar escola.'
  } finally {
    carregando.value = false
  }
}
</script>

<template>
  <div class="pagina">

    <form
      class="cartao"
      @submit.prevent="registrar"
    >

      <h1>📚 Cadastrar Escola</h1>
      <p>Crie o acesso da sua escola ao Booktrack.</p>

      <div
        v-if="erro"
        class="erro"
      >
        {{ erro }}
      </div>

      <div class="campo">
        <label>Nome da escola</label>

        <input
          v-model="nomeEscola"
          type="text"
          placeholder="Ex.: Escola Municipal João Silva"
        />
      </div>

      <div class="campo">
        <label>Município</label>

        <input
          v-model="municipio"
          type="text"
          placeholder="Ex.: Fortaleza - CE"
        />
      </div>

      <div class="campo">
        <label>Seu nome</label>

        <input
          v-model="nomeUsuario"
          type="text"
          placeholder="Ex.: Maria Souza"
        />
      </div>

      <div class="campo">
        <label>E-mail</label>

        <input
          v-model="email"
          type="email"
          placeholder="seu@email.com"
          autocomplete="username"
        />
      </div>

      <div class="campo">
        <label>Senha</label>

        <input
          v-model="senha"
          type="password"
          placeholder="Mínimo 6 caracteres"
          autocomplete="new-password"
        />
      </div>

      <button
        type="submit"
        class="btn-primario"
        :disabled="carregando"
      >
        {{ carregando ? 'Cadastrando...' : 'Cadastrar' }}
      </button>

      <p class="rodape">
        Já tem uma conta?
        <RouterLink to="/login">Entrar</RouterLink>
      </p>

    </form>

  </div>
</template>

<style scoped>
.pagina {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f7fa;
  padding: 20px;
}

.cartao {
  background: white;
  border-radius: 12px;
  padding: 40px;
  width: 100%;
  max-width: 420px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
}

.cartao h1 {
  font-size: 1.6rem;
  margin-bottom: 6px;
}

.cartao > p {
  color: #6b7280;
  margin-bottom: 25px;
}

.erro {
  background: #fee2e2;
  color: #dc2626;
  padding: 10px 14px;
  border-radius: 8px;
  margin-bottom: 18px;
  font-size: 14px;
}

.campo {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
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

.btn-primario {
  width: 100%;
  padding: 12px 20px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-weight: 600;
  background: #2563eb;
  color: white;
  font-size: 15px;
  margin-top: 8px;
}

.btn-primario:hover {
  background: #1d4ed8;
}

.btn-primario:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.rodape {
  text-align: center;
  margin-top: 20px;
  color: #6b7280;
  font-size: 14px;
}

.rodape a {
  color: #2563eb;
  font-weight: 600;
  text-decoration: none;
}

.rodape a:hover {
  text-decoration: underline;
}
</style>
