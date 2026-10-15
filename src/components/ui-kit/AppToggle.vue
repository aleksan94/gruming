<script setup lang="ts">
defineProps<{
  title: string
}>()
</script>

<template>
  <details class="toggle">
    <summary>{{ title }}</summary>
    <div class="content">
      <slot />
    </div>
  </details>
</template>

<style scoped lang="scss">
.toggle {
  padding: 0 22px;
  border-radius: 20px;
  background: $white;

  summary {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    padding: 18px 0;
    font-weight: 800;
    cursor: pointer;
    list-style: none;

    &::-webkit-details-marker {
      display: none;
    }

    &::after {
      content: '';
      flex: none;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background:
        url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23333' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m7 10 5 5 5-5'/%3E%3C/svg%3E")
        center / 18px no-repeat,
        rgb(0 0 0 / 6%);
      transition:
        transform 0.25s ease,
        background-color 0.25s ease;
    }

    &:hover::after {
      background-color: rgb(0 0 0 / 12%);
    }
  }

  &[open] > summary::after {
    transform: rotate(180deg);
  }

  .content {
    padding-bottom: 18px;
    line-height: 1.55;
    color: var(--muted);
  }
}
</style>
