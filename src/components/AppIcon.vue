<script setup lang="ts">
import { computed, type Component } from 'vue'
import type { IconName } from '../data/salon'

const props = withDefaults(defineProps<{ name: IconName; size?: number }>(), { size: 24 })

// Контурные иконки 24x24 лежат в src/assets/icons/<name>.svg; имя файла = IconName.
const icons = import.meta.glob('../assets/icons/*.svg', {
  eager: true,
  query: '?component',
  import: 'default',
}) as Record<string, Component>

const icon = computed(() => icons[`../assets/icons/${props.name}.svg`])
</script>

<template>
  <component :is="icon" :width="size" :height="size" />
</template>
