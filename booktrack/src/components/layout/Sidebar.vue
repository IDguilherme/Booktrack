<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { AuthService } from '../../services/auth/AuthService'
import { useConfirm } from '../../composables/useConfirm'

const router = useRouter()
const sessao = AuthService.obterSessao()
const { confirmar } = useConfirm()

const menuAberto = ref(false)

function fecharMenu() {
  menuAberto.value = false
}

async function sair() {
  const confirmou = await confirmar('Deseja realmente sair?')

  if (!confirmou) {
    return
  }

  AuthService.logout()
  router.push('/login')
}
</script>

<template>
  <button
    class="btn-menu"
    aria-label="Abrir menu"
    @click="menuAberto = true"
  >
    ☰
  </button>

  <div
    v-if="menuAberto"
    class="backdrop"
    @click="fecharMenu"
  />

  <aside
    class="sidebar"
    :class="{ 'sidebar-aberta': menuAberto }"
  >

    <div class="cabecalho-sidebar">
      <h2>📚 BookTrack</h2>

      <button
        class="btn-fechar"
        aria-label="Fechar menu"
        @click="fecharMenu"
      >
        ✕
      </button>
    </div>

    <div
      v-if="sessao"
      class="escola-info"
    >
      <strong>{{ sessao.escola.nome }}</strong>
      <small>{{ sessao.escola.municipio }}</small>
    </div>

    <nav>

      <RouterLink
        to="/"
        @click="fecharMenu"
      >
        📊 Dashboard
      </RouterLink>

      <RouterLink
        to="/livros"
        @click="fecharMenu"
      >
        📖 Livros
      </RouterLink>

      <RouterLink
        to="/alunos"
        @click="fecharMenu"
      >
        👨‍🎓 Alunos
      </RouterLink>

      <RouterLink
        to="/relatorios"
        @click="fecharMenu"
      >
        📑 Relatórios
      </RouterLink>

      <RouterLink
        to="/usuarios"
        @click="fecharMenu"
      >
        👥 Usuários
      </RouterLink>

    </nav>

    <button
      class="btn-sair"
      @click="sair"
    >
      🚪 Sair
    </button>

  </aside>
</template>

<style scoped>
.sidebar {
  width: 250px;
  min-height: 100vh;
  background: #1f2937;
  color: white;
  padding: 25px;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
}

.cabecalho-sidebar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.cabecalho-sidebar h2 {
  margin: 0;
}

.btn-menu,
.btn-fechar {
  display: none;
}

.escola-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 12px;
  margin-bottom: 20px;
  background: rgba(255, 255, 255, 0.06);
  border-radius: 8px;
}

.escola-info small {
  color: #9ca3af;
}

nav {
  display: flex;
  flex-direction: column;
  gap: 15px;
  flex: 1;
}

a {
  color: white;
  text-decoration: none;
  padding: 10px;
  border-radius: 8px;
}

a:hover {
  background: rgba(255, 255, 255, 0.1);
}

.router-link-active {
  background: #2563eb;
}

.btn-sair {
  margin-top: 20px;
  padding: 10px;
  border: none;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.08);
  color: white;
  cursor: pointer;
  text-align: left;
  font-size: 15px;
}

.btn-sair:hover {
  background: rgba(220, 38, 38, 0.5);
}

.backdrop {
  display: none;
}

/* Mobile e tablet: sidebar vira uma gaveta lateral */
@media (max-width: 768px) {
  .btn-menu {
    display: flex;
    align-items: center;
    justify-content: center;
    position: fixed;
    top: 16px;
    left: 16px;
    width: 44px;
    height: 44px;
    border-radius: 10px;
    border: none;
    background: #1f2937;
    color: white;
    font-size: 20px;
    z-index: 1000;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  }

  .btn-fechar {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border-radius: 8px;
    border: none;
    background: rgba(255, 255, 255, 0.1);
    color: white;
    font-size: 16px;
    cursor: pointer;
  }

  .backdrop {
    display: block;
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 998;
  }

  .sidebar {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 999;
    width: 260px;
    transform: translateX(-100%);
    transition: transform 0.25s ease;
  }

  .sidebar.sidebar-aberta {
    transform: translateX(0);
  }
}
</style>
