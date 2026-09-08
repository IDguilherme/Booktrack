<script setup lang="ts">
import { useToast } from '../../composables/useToast'

const { toasts } = useToast()
</script>

<template>
  <Teleport to="body">
    <div class="toast-container">

      <TransitionGroup name="toast">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          class="toast"
          :class="`toast-${toast.tipo}`"
        >
          <span class="icone">
            {{ toast.tipo === 'sucesso' ? '✅' : toast.tipo === 'erro' ? '⚠️' : 'ℹ️' }}
          </span>

          <span>{{ toast.mensagem }}</span>
        </div>
      </TransitionGroup>

    </div>
  </Teleport>
</template>

<style scoped>
.toast-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-width: min(360px, calc(100vw - 40px));
}

.toast {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 18px;
  border-radius: 10px;
  color: white;
  font-size: 14px;
  font-weight: 500;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
}

.toast-sucesso {
  background: #16a34a;
}

.toast-erro {
  background: #dc2626;
}

.toast-info {
  background: #2563eb;
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.25s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

@media (max-width: 600px) {
  .toast-container {
    top: auto;
    bottom: 20px;
    right: 20px;
    left: 20px;
    max-width: none;
  }
}
</style>
