import type { Livro } from '../../models/Livro'
import { api } from '../api'

export const DIAS_PRAZO_EMPRESTIMO = 30

export interface EmprestimoAtivo {
  id: number
  livroId: number
  livroTitulo: string
  aluno: string
  data: string
  diasEmprestado: number
  atrasado: boolean
}

export interface NovoLivro {
  titulo: string
  autor: string
  categoria: string
  ano: number
  quantidade: number
}

export interface LivroMaisEmprestado {
  titulo: string
  total: number
}

export class LivroService {

  static listar(): Promise<Livro[]> {
    return api.get('/livros')
  }

  static async buscarPorId(id: number): Promise<Livro | undefined> {
    const livros = await this.listar()

    return livros.find(livro => livro.id === id)
  }

  static salvar(livro: NovoLivro): Promise<{ id: number }> {
    return api.post('/livros', livro)
  }

  static atualizar(livro: Livro): Promise<{ atualizado: boolean }> {
    return api.put(`/livros/${livro.id}`, livro)
  }

  static excluir(id: number): Promise<{ excluido: boolean }> {
    return api.delete(`/livros/${id}`)
  }

  static emprestar(livroId: number, aluno: string): Promise<{ id: number }> {
    return api.post(`/livros/${livroId}/emprestar`, { aluno })
  }

  static devolver(livroId: number, emprestimoId: number): Promise<{ devolvido: boolean }> {
    return api.post(`/livros/${livroId}/devolver/${emprestimoId}`)
  }

  static listarEmprestimosAtivos(): Promise<EmprestimoAtivo[]> {
    return api.get('/relatorios/emprestimos-ativos')
  }

  static listarMaisEmprestados(): Promise<LivroMaisEmprestado[]> {
    return api.get('/relatorios/livros-mais-emprestados')
  }

  static uploadCapa(livroId: number, arquivo: File): Promise<{ capaUrl: string }> {
    const formData = new FormData()
    formData.append('capa', arquivo)

    return api.upload(`/livros/${livroId}/capa`, formData)
  }
}
