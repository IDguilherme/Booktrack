export interface EmprestimoAtual {
  id: number
  aluno: string
  data: string
}

export interface Livro {
  id: number
  titulo: string
  autor: string
  categoria: string
  ano: number
  quantidade: number
  capaUrl?: string | null

  emprestimos: EmprestimoAtual[]
}