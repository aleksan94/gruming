<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import AppIcon from './AppIcon.vue'

const SHOW_AFTER = 400
const visible = ref(false)

const onScroll = () => {
  visible.value = window.scrollY > SHOW_AFTER
}

onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
})
onUnmounted(() => window.removeEventListener('scroll', onScroll))
</script>

<template>
  <a class="to-top" :class="{ 'to-top--visible': visible }" href="#top" aria-label="Наверх" :tabindex="visible ? 0 : -1">
    <AppIcon name="arrow-up" :size="26" />
  </a>
</template>

<style scoped lang="scss">
.to-top {
  position: fixed;
  right: var(--gutter);
  bottom: 24px;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 52px;
  height: 52px;
  border-radius: $radius-pill;
  background: var(--accent);
  color: $white;
  box-shadow: 0 6px 18px rgb(31 58 61 / 25%);
  opacity: 0;
  visibility: hidden;
  transform: translateY(12px);
  transition:
    opacity 0.25s,
    transform 0.25s,
    visibility 0.25s,
    background 0.2s;

  &--visible {
    opacity: 1;
    visibility: visible;
    transform: none;
  }

  &:hover {
    background: var(--ink);
  }

  @include reduced-motion {
    transition: none;
  }
}
</style>
