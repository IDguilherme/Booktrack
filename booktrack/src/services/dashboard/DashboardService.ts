import { api } from '../api'

export interface Estatisticas {
  totalLivros: number
  totalAlunos: number
  emprestimosAtivos: number
  emprestimosAtrasados: number
}

export class DashboardService {

  static buscar(): Promise<Estatisticas> {
    return api.get('/dashboard')
  }
}
