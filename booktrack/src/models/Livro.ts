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

  emprestimos: EmprestimoAtual[]
}