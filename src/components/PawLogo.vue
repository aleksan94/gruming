<script setup>
defineProps({ size: { type: Number, default: 44 } })
</script>

<template>
  <svg :width="size" :height="size" viewBox="0 0 40 40" aria-hidden="true">
    <circle cx="20" cy="20" r="20" fill="#FFD66B" />
    <g fill="#1F3A3D">
      <ellipse cx="20" cy="25" rx="6.5" ry="5.2" />
      <circle cx="11.5" cy="19" r="2.6" />
      <circle cx="16.5" cy="13.5" r="2.7" />
      <circle cx="23.5" cy="13.5" r="2.7" />
      <circle cx="28.5" cy="19" r="2.6" />
    </g>
  </svg>
</template>
