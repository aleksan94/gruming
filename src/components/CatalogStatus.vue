<script setup lang="ts">
import AppIcon from './AppIcon.vue'

defineProps<{ status: 'loading' | 'error' }>()
defineEmits<{ retry: [] }>()
</script>

<template>
  <div class="state" role="status">
    <template v-if="status === 'loading'">
      <AppIcon name="paw" :size="28" />
      <p>Загружаем данные…</p>
    </template>
    <template v-else>
      <p>Не удалось загрузить данные. Проверьте интернет и попробуйте ещё раз.</p>
      <button type="button" class="btn btn--outline" @click="$emit('retry')">Повторить</button>
    </template>
  </div>
</template>

<style scoped lang="scss">
.state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  padding: 48px 16px;
  text-align: center;
  color: var(--muted, inherit);

  p {
    margin: 0;
  }
}
</style>
