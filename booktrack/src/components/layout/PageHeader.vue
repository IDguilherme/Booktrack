<script setup lang="ts">
defineProps<{
  titulo: string
  descricao: string
}>()
</script>

<template>
  <header class="page-header">
    <h1>{{ titulo }}</h1>
    <p>{{ descricao }}</p>
  </header>
</template>

<style scoped>
.page-header {
  margin-bottom: 30px;
}

.page-header h1 {
  font-size: 2rem;
  color: #1f2937;
}

.page-header p {
  margin-top: 8px;
  color: #6b7280;
}
</style>