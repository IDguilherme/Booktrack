import type { HistoricoEmprestimo } from '../../models/HistoricoEmprestimo'
import { api } from '../api'

export class HistoricoService {

  static listar(): Promise<HistoricoEmprestimo[]> {
    return api.get('/relatorios/historico')
  }
}
