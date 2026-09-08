import { reactive } from 'vue'

export interface Toast {
  id: number
  mensagem: string
  tipo: 'sucesso' | 'erro' | 'info'
}

const toasts = reactive<Toast[]>([])
let proximoId = 1

function mostrarToast(mensagem: string, tipo: Toast['tipo']) {
  const id = proximoId++

  toasts.push({ id, mensagem, tipo })

  setTimeout(() => {
    const indice = toasts.findIndex(toast => toast.id === id)

    if (indice !== -1) {
      toasts.splice(indice, 1)
    }
  }, 4000)
}

export function useToast() {
  return {
    toasts,
    sucesso: (mensagem: string) => mostrarToast(mensagem, 'sucesso'),
    erro: (mensagem: string) => mostrarToast(mensagem, 'erro'),
    info: (mensagem: string) => mostrarToast(mensagem, 'info')
  }
}
