<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  dados: { titulo: string; total: number }[]
}>()

const maior = computed(() =>
  Math.max(...props.dados.map(item => item.total), 1)
)

const cores = [
  '#2563eb',
  '#7c3aed',
  '#0891b2',
  '#059669',
  '#d97706',
  '#dc2626',
  '#db2777',
  '#4f46e5',
  '#0d9488',
  '#65a30d'
]
</script>

<template>
  <div class="grafico">

    <div
      v-if="!dados.length"
      class="vazio"
    >
      <p>📈 Ainda não há empréstimos suficientes para gerar o gráfico.</p>
    </div>

    <div
      v-else
      class="barras"
    >
      <div
        v-for="(item, indice) in dados"
        :key="item.titulo"
        class="linha"
      >

        <span class="titulo" :title="item.titulo">
          {{ item.titulo }}
        </span>

        <div class="trilha">
          <div
            class="barra"
            :style="{
              width: `${(item.total / maior) * 100}%`,
              background: cores[indice % cores.length]
            }"
          >
            <span class="valor">{{ item.total }}</span>
          </div>
        </div>

      </div>
    </div>

  </div>
</template>

<style scoped>
.grafico {
  width: 100%;
}

.vazio {
  text-align: center;
  padding: 30px 20px;
  color: #6b7280;
}

.barras {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.linha {
  display: grid;
  grid-template-columns: 160px 1fr;
  align-items: center;
  gap: 12px;
}

.titulo {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.trilha {
  background: #f3f4f6;
  border-radius: 8px;
  height: 28px;
  overflow: hidden;
}

.barra {
  height: 100%;
  min-width: 34px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 10px;
  transition: width 0.4s ease;
}

.valor {
  color: white;
  font-size: 13px;
  font-weight: 700;
}

@media (max-width: 600px) {
  .linha {
    grid-template-columns: 100px 1fr;
  }

  .titulo {
    font-size: 12px;
  }
}
</style>
