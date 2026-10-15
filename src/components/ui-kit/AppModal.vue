<script setup lang="ts">
import { nextTick, onBeforeUnmount, ref, watch } from 'vue'
import { useScrollLock } from '../../composables/scrollLock'

const props = withDefaults(defineProps<{ modelValue: boolean; title?: string; width?: number }>(), {
  title: '',
  width: 560,
})
const emit = defineEmits<{ 'update:modelValue': [value: boolean] }>()

const { lock, unlock } = useScrollLock()
const dialog = ref<HTMLElement | null>(null)
let opener: HTMLElement | null = null

function close() {
  emit('update:modelValue', false)
}

function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape') close()
}

watch(
  () => props.modelValue,
  async (open) => {
    if (open) {
      opener = document.activeElement as HTMLElement | null
      lock()
      document.addEventListener('keydown', onKey)
      await nextTick()
      dialog.value?.focus()
    } else {
      unlock()
      document.removeEventListener('keydown', onKey)
      opener?.focus()
    }
  },
)

onBeforeUnmount(() => {
  document.removeEventListener('keydown', onKey)
})
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="modelValue" class="overlay" @mousedown.self="close">
        <div
          ref="dialog"
          class="dialog"
          role="dialog"
          aria-modal="true"
          :aria-label="title"
          tabindex="-1"
          :style="{ maxWidth: width + 'px' }"
        >
          <button type="button" class="close" aria-label="Закрыть" @click="close">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.5"
              stroke-linecap="round"
            >
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
          <div class="body">
            <slot />
          </div>
          <div v-if="$slots.footer" class="footer">
            <slot name="footer" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped lang="scss">
.overlay {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  background: rgb(31 58 61 / 45%);
  backdrop-filter: blur(4px);
}

.dialog {
  position: relative;
  width: 100%;
  max-height: calc(100dvh - 32px);
  display: flex;
  flex-direction: column;
  background: $white;
  border-radius: 28px;
  box-shadow: 0 24px 60px rgb(31 58 61 / 25%);
  outline: none;
  overflow: hidden;
}

.close {
  position: absolute;
  top: 16px;
  right: 16px;
  z-index: 1;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 0;
  border-radius: 50%;
  background: rgb(255 255 255 / 80%);
  color: var(--ink);
  cursor: pointer;

  &:hover {
    background: var(--mint);
  }
}

.body {
  overflow-y: auto;
  overscroll-behavior: contain;
  min-height: 0;
}

.footer {
  padding: 16px 28px;
  border-top: 1px solid var(--card-border);
  background: $white;
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;

  .dialog {
    transition:
      transform 0.25s ease,
      opacity 0.2s ease;
  }
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;

  .dialog {
    transform: translateY(16px) scale(0.97);
  }
}

@media (prefers-reduced-motion: reduce) {
  .modal-enter-active,
  .modal-leave-active,
  .modal-enter-active .dialog,
  .modal-leave-active .dialog {
    transition: none;
  }
}
</style>
