<script setup lang="ts">
import type { IconName } from '../data/salon'

withDefaults(defineProps<{ name: IconName; size?: number }>(), { size: 24 })

// Контурные иконки 24x24; рисуются stroke-ом, кроме `paw` (заливка).
const ICONS: Record<IconName, string> = {
  heart: '<path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.5-7 10-7 10z"/>',
  drop: '<path d="M12 3c3 4 6 7 6 11a6 6 0 0 1-12 0c0-4 3-7 6-11z"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  video: '<rect x="3" y="7" width="13" height="10" rx="3"/><path d="M16 11l5-3v8l-5-3z"/>',
  scissors: '<circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M8.5 7.5L20 18M8.5 16.5L20 6"/>',
  waves: '<path d="M3 15c3-6 6-6 9 0s6 6 9 0"/><path d="M3 9c3-6 6-6 9 0s6 6 9 0"/>',
  comb: '<path d="M5 4v16M9 4v16M13 4v16M17 4v10"/>',
  sparkle: '<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/><path d="M19 17v4M17 19h4"/>',
  pin: '<path d="M12 21s-7-6-7-11.5a7 7 0 0 1 14 0C19 15 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
  phone: '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="3"/><path d="M4 7l8 6 8-6"/>',
  check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
  play: '<path d="M8 5.5v13l11-6.5z"/>',
  pause: '<rect x="6" y="5" width="4" height="14" rx="1.2"/><rect x="14" y="5" width="4" height="14" rx="1.2"/>',
  paw: '<ellipse cx="12" cy="16" rx="5" ry="4"/><circle cx="5.5" cy="11.5" r="2"/><circle cx="9.5" cy="6.5" r="2.1"/><circle cx="14.5" cy="6.5" r="2.1"/><circle cx="18.5" cy="11.5" r="2"/>',
}
const FILLED = new Set(['paw', 'play', 'pause'])
</script>

<template>
  <svg
    :width="size" :height="size" viewBox="0 0 24 24" aria-hidden="true"
    :fill="FILLED.has(name) ? 'currentColor' : 'none'"
    :stroke="FILLED.has(name) ? 'none' : 'currentColor'"
    stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"
    v-html="ICONS[name]"
  />
</template>
