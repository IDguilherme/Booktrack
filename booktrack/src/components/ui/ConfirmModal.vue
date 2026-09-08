<script setup lang="ts">
import { useConfirm } from '../../composables/useConfirm'

const { estado, responder } = useConfirm()
</script>

<template>
  <Teleport to="body">
    <div
      v-if="estado.aberto"
      class="fundo"
      @click.self="responder(false)"
    >
      <div class="modal">

        <p>{{ estado.mensagem }}</p>

        <div class="acoes">

          <button
            class="btn-secundario"
            @click="responder(false)"
          >
            Cancelar
          </button>

          <button
            class="btn-perigo"
            @click="responder(true)"
          >
            Confirmar
          </button>

        </div>

      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.fundo {
  position: fixed;
  inset: 0;
  background: rgba(17, 24, 39, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9998;
  padding: 20px;
}

.modal {
  background: white;
  border-radius: 12px;
  padding: 25px;
  width: 100%;
  max-width: 380px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.modal p {
  font-size: 15px;
  color: #1f2937;
  margin-bottom: 20px;
  line-height: 1.4;
}

.acoes {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.acoes button {
  padding: 10px 18px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-weight: 600;
  font-size: 14px;
}

.btn-secundario {
  background: #e5e7eb;
  color: #374151;
}

.btn-secundario:hover {
  background: #d1d5db;
}

.btn-perigo {
  background: #dc2626;
  color: white;
}

.btn-perigo:hover {
  background: #b91c1c;
}

@media (max-width: 480px) {
  .acoes {
    flex-direction: column-reverse;
  }

  .acoes button {
    width: 100%;
  }
}
</style>
