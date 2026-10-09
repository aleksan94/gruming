<script setup lang="ts">
defineOptions({ inheritAttrs: false })

const props = defineProps<{ format?: (value: string) => string }>()
const model = defineModel<string>({ required: true })

function onInput(e: Event) {
  const el = e.target as HTMLInputElement
  const value = props.format ? props.format(el.value) : el.value
  // Перезаписываем DOM явно: если модель не изменилась, Vue сам значение не обновит.
  el.value = value
  model.value = value
}
</script>

<template>
  <input v-bind="$attrs" :value="model" class="input" @input="onInput" />
</template>
