<script setup lang="ts">
import { computed, useAttrs } from 'vue'
import AppIcon from '../AppIcon.vue'
import type { IconName } from '../../data/salon'

defineOptions({ inheritAttrs: false })

const props = defineProps<{ format?: (value: string) => string; icon?: IconName }>()
const model = defineModel<string>({ required: true })

// С иконкой корнем становится обёртка: class и style относятся к ней, остальные атрибуты — к самому input.
const attrs = useAttrs()
const wrapAttrs = computed(() => ({ class: attrs.class, style: attrs.style }))
const inputAttrs = computed(() => {
  const { ...rest } = attrs
  return rest
})

function onInput(e: Event) {
  const el = e.target as HTMLInputElement
  const value = props.format ? props.format(el.value) : el.value
  // Перезаписываем DOM явно: если модель не изменилась, Vue сам значение не обновит.
  el.value = value
  model.value = value
}
</script>

<template>
  <span v-if="icon" class="input-wrap" v-bind="wrapAttrs">
    <AppIcon :name="icon" :size="20" class="input-icon" />
    <input v-bind="inputAttrs" :value="model" class="input" @input="onInput" />
  </span>
  <input v-else v-bind="$attrs" :value="model" class="input" @input="onInput" />
</template>

<style scoped lang="scss">
.input-wrap {
  position: relative;
  display: block;

  .input {
    padding-left: 44px;
  }
}

.input-icon {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--muted);
  pointer-events: none;
}
</style>
