<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { AuthService } from '../services/auth/AuthService'
import { useToast } from '../composables/useToast'

const route = useRoute()
const router = useRouter()
const toast = useToast()

const novaSenha = ref('')
const confirmarSenha = ref('')
const carregando = ref(false)
const erro = ref('')

async function redefinir() {
  if (!novaSenha.value.trim() || !confirmarSenha.value.trim()) {
    erro.value = 'Preencha os dois campos.'
    return
  }

  if (novaSenha.value.length < 6) {
    erro.value = 'A senha deve ter pelo menos 6 caracteres.'
    return
  }

  if (novaSenha.value !== confirmarSenha.value) {
    erro.value = 'As senhas não coincidem.'
    return
  }

  erro.value = ''
  carregando.value = true

  try {
    const token = String(route.params.token)

    await AuthService.redefinirSenha(token, novaSenha.value)

    toast.sucesso('Senha redefinida com sucesso! Faça login com a nova senha.')
    router.push('/login')
  } catch (e) {
    erro.value = e instanceof Error ? e.message : 'Erro ao redefinir senha.'
  } finally {
    carregando.value = false
  }
}
</script>

<template>
  <div class="pagina">

    <form
      class="cartao"
      @submit.prevent="redefinir"
    >

      <h1>🔑 Redefinir Senha</h1>
      <p>Escolha uma nova senha para acessar sua conta.</p>

      <div
        v-if="erro"
        class="erro"
      >
        {{ erro }}
      </div>

      <div class="campo">
        <label>Nova senha</label>

        <input
          v-model="novaSenha"
          type="password"
          placeholder="Mínimo 6 caracteres"
          autocomplete="new-password"
        />
      </div>

      <div class="campo">
        <label>Confirmar nova senha</label>

        <input
          v-model="confirmarSenha"
          type="password"
          placeholder="Repita a senha"
          autocomplete="new-password"
        />
      </div>

      <button
        type="submit"
        class="btn-primario"
        :disabled="carregando"
      >
        {{ carregando ? 'Salvando...' : 'Redefinir senha' }}
      </button>

      <p class="rodape">
        <RouterLink to="/login">Voltar para o login</RouterLink>
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
  max-width: 400px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
}

.cartao h1 {
  font-size: 1.5rem;
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
  margin-bottom: 18px;
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
