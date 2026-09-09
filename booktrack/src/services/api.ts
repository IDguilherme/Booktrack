// Endereço da API do backend (Node + Express + SQLite).
// Em produção, defina VITE_API_URL no seu provedor de hospedagem
// (ex.: https://booktrack-backend.up.railway.app/api).
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

// Endereço base do backend, sem o "/api" no final - usado para montar URLs
// de arquivos servidos estaticamente (ex.: capas de livros em /uploads/...).
export const API_BASE = API_URL.replace(/\/api\/?$/, '')

function obterToken(): string | null {
  return localStorage.getItem('booktrack_token')
}

function cabecalhos(): Record<string, string> {
  const token = obterToken()
  const base: Record<string, string> = { 'Content-Type': 'application/json' }

  if (token) {
    base.Authorization = `Bearer ${token}`
  }

  return base
}

async function tratarResposta(resposta: Response) {
  if (resposta.status === 401) {
    localStorage.removeItem('booktrack_token')
    localStorage.removeItem('booktrack_usuario')

    if (window.location.pathname !== '/login') {
      window.location.href = '/login'
    }

    throw new Error('Sessão expirada. Faça login novamente.')
  }

  if (!resposta.ok) {
    const corpo = await resposta.json().catch(() => null)
    throw new Error(corpo?.erro || `Erro na requisição (status ${resposta.status}).`)
  }

  if (resposta.status === 204) {
    return null
  }

  return resposta.json()
}

export const api = {
  get(caminho: string) {
    return fetch(`${API_URL}${caminho}`, { headers: cabecalhos() }).then(tratarResposta)
  },

  post(caminho: string, dados?: unknown) {
    return fetch(`${API_URL}${caminho}`, {
      method: 'POST',
      headers: cabecalhos(),
      body: dados !== undefined ? JSON.stringify(dados) : undefined
    }).then(tratarResposta)
  },

  put(caminho: string, dados: unknown) {
    return fetch(`${API_URL}${caminho}`, {
      method: 'PUT',
      headers: cabecalhos(),
      body: JSON.stringify(dados)
    }).then(tratarResposta)
  },

  delete(caminho: string) {
    return fetch(`${API_URL}${caminho}`, { method: 'DELETE', headers: cabecalhos() }).then(tratarResposta)
  },

  upload(caminho: string, formData: FormData) {
    const token = obterToken()
    const headers: Record<string, string> = {}

    // Não define Content-Type manualmente: o navegador precisa gerar o
    // boundary correto do multipart/form-data sozinho.
    if (token) {
      headers.Authorization = `Bearer ${token}`
    }

    return fetch(`${API_URL}${caminho}`, {
      method: 'POST',
      headers,
      body: formData
    }).then(tratarResposta)
  }
}
