import { api } from '../api'

export interface Usuario {
  id: number
  nome: string
  email: string
}

export interface Escola {
  id: number
  nome: string
  municipio: string
}

export interface RespostaAutenticacao {
  token: string
  usuario: Usuario
  escola: Escola
}

export interface DadosRegistroEscola {
  nomeEscola: string
  municipio: string
  nomeUsuario: string
  email: string
  senha: string
}

const CHAVE_TOKEN = 'booktrack_token'
const CHAVE_USUARIO = 'booktrack_usuario'

export class AuthService {

  static async login(email: string, senha: string): Promise<RespostaAutenticacao> {
    const resposta: RespostaAutenticacao = await api.post('/auth/login', { email, senha })

    this.salvarSessao(resposta)

    return resposta
  }

  static async registrarEscola(dados: DadosRegistroEscola): Promise<RespostaAutenticacao> {
    const resposta: RespostaAutenticacao = await api.post('/auth/registrar-escola', dados)

    this.salvarSessao(resposta)

    return resposta
  }

  static salvarSessao(resposta: RespostaAutenticacao) {
    localStorage.setItem(CHAVE_TOKEN, resposta.token)
    localStorage.setItem(
      CHAVE_USUARIO,
      JSON.stringify({ usuario: resposta.usuario, escola: resposta.escola })
    )
  }

  static logout() {
    localStorage.removeItem(CHAVE_TOKEN)
    localStorage.removeItem(CHAVE_USUARIO)
  }

  static esqueciSenha(email: string): Promise<{ mensagem: string }> {
    return api.post('/auth/esqueci-senha', { email })
  }

  static redefinirSenha(token: string, novaSenha: string): Promise<{ redefinida: boolean }> {
    return api.post('/auth/redefinir-senha', { token, novaSenha })
  }

  static estaAutenticado(): boolean {
    return Boolean(localStorage.getItem(CHAVE_TOKEN))
  }

  static obterSessao(): { usuario: Usuario; escola: Escola } | null {
    const dados = localStorage.getItem(CHAVE_USUARIO)

    return dados ? JSON.parse(dados) : null
  }
}
