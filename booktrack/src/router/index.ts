import { createRouter, createWebHistory } from 'vue-router'

import { AuthService } from '../services/auth/AuthService'

import DashboardView from '../views/DashboardView.vue'
import LivrosView from '../views/LivrosView.vue'
import NovoLivroView from '../views/NovoLivroView.vue'
import EditarLivroView from '../views/EditarLivroView.vue'
import AlunosView from '../views/AlunosView.vue'
import RelatoriosView from '../views/RelatoriosView.vue'
import UsuariosView from '../views/UsuariosView.vue'
import LoginView from '../views/LoginView.vue'
import RegistrarEscolaView from '../views/RegistrarEscolaView.vue'
import EsqueciSenhaView from '../views/EsqueciSenhaView.vue'
import RedefinirSenhaView from '../views/RedefinirSenhaView.vue'

const router = createRouter({
  history: createWebHistory(),

  routes: [
    {
      path: '/login',
      component: LoginView,
      meta: { publica: true }
    },

    {
      path: '/registrar-escola',
      component: RegistrarEscolaView,
      meta: { publica: true }
    },

    {
      path: '/esqueci-senha',
      component: EsqueciSenhaView,
      meta: { publica: true }
    },

    {
      path: '/redefinir-senha/:token',
      component: RedefinirSenhaView,
      meta: { publica: true }
    },

    {
      path: '/',
      component: DashboardView
    },

    {
      path: '/livros',
      component: LivrosView
    },

    {
      path: '/livros/novo',
      component: NovoLivroView
    },

    {
      path: '/livros/editar/:id',
      component: EditarLivroView
    },

    {
      path: '/alunos',
      component: AlunosView
    },

    {
      path: '/relatorios',
      component: RelatoriosView
    },

    {
      path: '/usuarios',
      component: UsuariosView
    }
  ]
})

router.beforeEach(rota => {
  if (rota.meta.publica) {
    return true
  }

  if (!AuthService.estaAutenticado()) {
    return '/login'
  }

  return true
})

export default router
