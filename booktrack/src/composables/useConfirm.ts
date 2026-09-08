import { reactive } from 'vue'

interface EstadoConfirmacao {
  aberto: boolean
  mensagem: string
  resolver: ((valor: boolean) => void) | null
}

const estado = reactive<EstadoConfirmacao>({
  aberto: false,
  mensagem: '',
  resolver: null
})

function confirmar(mensagem: string): Promise<boolean> {
  estado.mensagem = mensagem
  estado.aberto = true

  return new Promise(resolve => {
    estado.resolver = resolve
  })
}

function responder(valor: boolean) {
  estado.aberto = false
  estado.resolver?.(valor)
  estado.resolver = null
}

export function useConfirm() {
  return { estado, confirmar, responder }
}
