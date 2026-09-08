export class StorageService {
  static salvar<T>(chave: string, dados: T): void {
    localStorage.setItem(chave, JSON.stringify(dados))
  }

  static buscar<T>(chave: string): T | null {
    const dados = localStorage.getItem(chave)

    if (!dados) {
      return null
    }

    return JSON.parse(dados)
  }

  static remover(chave: string): void {
    localStorage.removeItem(chave)
  }
}