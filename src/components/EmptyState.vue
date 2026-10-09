<script setup lang="ts">
import AppIcon from './AppIcon.vue'
import IconBadge from './IconBadge.vue'

defineProps<{ query: string; compact?: boolean }>()
defineEmits<{ reset: [] }>()
</script>

<template>
  <div v-if="compact" class="empty empty--compact" role="status">
    <AppIcon name="search" :size="20" />
    <p class="line">По запросу «{{ query.trim() }}» ничего нет</p>
    <button type="button" class="reset" @click="$emit('reset')">Сбросить</button>
  </div>
  <div v-else class="empty" role="status">
    <IconBadge icon="search" tint="mint" :size="64" />
    <h3 class="title">Ничего не нашли</h3>
    <p class="text">
      По запросу «{{ query.trim() }}» нет совпадений. Проверьте написание или попробуйте другое
      слово.
    </p>
    <button type="button" class="btn btn--outline" @click="$emit('reset')">Сбросить поиск</button>
  </div>
</template>

<style scoped lang="scss">
.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  min-height: 240px;
  justify-content: center;
  padding: 32px 16px;
  text-align: center;
  border: 2px dashed var(--border);
  border-radius: 24px;
  animation: appear 0.25s ease-out;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }

  &--compact {
    flex-direction: row;
    justify-content: flex-start;
    gap: 10px;
    min-height: 56px;
    padding: 0 16px;
    border-radius: 16px;
    text-align: left;
    color: var(--muted);
  }
}

.line {
  flex: 1;
  min-width: 0;
  margin: 0;
  font-size: 15px;
  overflow-wrap: anywhere;
}

.reset {
  flex: none;
  padding: 0;
  border: 0;
  background: none;
  color: var(--accent);
  font-weight: 800;
  font-size: 15px;
  text-decoration: underline;
  cursor: pointer;
}

.title {
  margin: 4px 0 0;
  font-family: var(--font-head);
  font-size: 22px;
}

.text {
  margin: 0 0 8px;
  max-width: 420px;
  color: var(--muted);
  line-height: 1.5;
  overflow-wrap: anywhere;
}

@keyframes appear {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
}
</style>
