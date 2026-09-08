<script setup lang="ts">
import { useRoute } from 'vue-router'
import Sidebar from './components/layout/Sidebar.vue'
import ToastContainer from './components/ui/ToastContainer.vue'
import ConfirmModal from './components/ui/ConfirmModal.vue'

const route = useRoute()
</script>

<template>
  <div class="layout">
    <Sidebar v-if="!route.meta.publica" />

    <main
      class="content"
      :class="{ 'content-publica': route.meta.publica }"
    >
      <RouterView />
    </main>

    <ToastContainer />
    <ConfirmModal />
  </div>
</template>

<style scoped>
.layout {
  display: flex;
  min-height: 100vh;
}

.content {
  flex: 1;
  padding: 30px;
  background: #f5f7fa;
  min-width: 0;
}

.content-publica {
  padding: 0;
}

@media (max-width: 768px) {
  .content {
    padding: 20px 16px;
    padding-top: 76px;
  }

  .content-publica {
    padding: 0;
  }
}
</style>