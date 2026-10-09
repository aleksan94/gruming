<script setup lang="ts">
const props = defineProps<{ text?: string }>()
</script>

<template>
  <span class="tooltip" :class="{ 'has-tip': props.text }" :data-tip="props.text" :tabindex="props.text ? 0 : undefined">
    <slot />
  </span>
</template>

<style scoped lang="scss">
.tooltip {
  position: relative;
  min-width: 0;
  display: flex;
  outline: none;
}

.tooltip.has-tip::after {
  content: attr(data-tip);
  position: absolute;
  bottom: calc(100% + 8px);
  left: 50%;
  transform: translateX(-50%);
  z-index: 5;
  width: max-content;
  max-width: 220px;
  padding: 8px 12px;
  border-radius: 12px;
  background: var(--ink);
  color: $white;
  font-size: 13px;
  font-weight: 700;
  line-height: 1.3;
  text-align: center;
  text-decoration: none;
  pointer-events: none;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.15s;
}

.tooltip.has-tip:hover::after,
.tooltip.has-tip:focus-visible::after {
  opacity: 1;
  visibility: visible;
}
</style>
