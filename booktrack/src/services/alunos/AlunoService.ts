import type { Aluno } from '../../models/Aluno'
import { api } from '../api'

export interface NovoAluno {
  nome: string
  matricula: string
  turma: string
}

export class AlunoService {

  static listar(): Promise<Aluno[]> {
    return api.get('/alunos')
  }

  static async buscarPorId(id: number): Promise<Aluno | undefined> {
    const alunos = await this.listar()

    return alunos.find(aluno => aluno.id === id)
  }

  static salvar(aluno: NovoAluno): Promise<{ id: number }> {
    return api.post('/alunos', aluno)
  }

  static atualizar(aluno: Aluno): Promise<{ atualizado: boolean }> {
    return api.put(`/alunos/${aluno.id}`, aluno)
  }

  static excluir(id: number): Promise<{ excluido: boolean }> {
    return api.delete(`/alunos/${id}`)
  }
}
