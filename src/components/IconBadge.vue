<script setup>
import AppIcon from './AppIcon.vue'

defineProps({
  icon: { type: String, required: true },
  tint: { type: String, default: 'mint' },
  size: { type: Number, default: 56 },
})
</script>

<template>
  <span class="badge" :class="`tint-${tint}`" :style="{ '--size': size + 'px' }">
    <AppIcon :name="icon" :size="size / 2" />
  </span>
</template>

<style scoped>
.badge {
  width: var(--size); height: var(--size); flex: none; border-radius: 50%;
  display: flex; align-items: center; justify-content: center; color: var(--ink);
}
.tint-mint { background: var(--mint); }
.tint-sky { background: var(--sky); }
.tint-peach { background: var(--peach); }
.tint-butter { background: var(--butter); }
.tint-green { background: #CDEBDD; }
</style>
