import { api } from '../api'

export interface UsuarioEquipe {
  id: number
  nome: string
  email: string
}

export interface NovoUsuario {
  nome: string
  email: string
  senha: string
}

export class UsuarioService {

  static listar(): Promise<UsuarioEquipe[]> {
    return api.get('/usuarios')
  }

  static salvar(usuario: NovoUsuario): Promise<{ id: number }> {
    return api.post('/usuarios', usuario)
  }

  static excluir(id: number): Promise<{ excluido: boolean }> {
    return api.delete(`/usuarios/${id}`)
  }
}
