<script setup lang="ts">
import { onMounted, onUnmounted, reactive, ref } from 'vue'
import AppIcon from './AppIcon.vue'

const open = ref(false)
const done = ref(false)
const error = ref('')
const form = reactive({ name: '', phone: '' })
const root = ref<HTMLElement | null>(null)

function toggle() {
  open.value = !open.value
}

function submit() {
  if (!form.name.trim() || !form.phone.trim()) {
    error.value = 'Укажите имя и телефон.'
    return
  }
  error.value = ''
  done.value = true
}

function reset() {
  done.value = false
  form.name = ''
  form.phone = ''
}

const onDocClick = (e: MouseEvent) => {
  if (open.value && root.value && !root.value.contains(e.target as Node)) open.value = false
}
const onKey = (e: KeyboardEvent) => {
  if (e.key === 'Escape') open.value = false
}

onMounted(() => {
  document.addEventListener('click', onDocClick)
  document.addEventListener('keydown', onKey)
})
onUnmounted(() => {
  document.removeEventListener('click', onDocClick)
  document.removeEventListener('keydown', onKey)
})
</script>

<template>
  <div ref="root" class="callback">
    <Transition name="callback-pop">
      <div
        v-if="open"
        id="callback-panel"
        class="callback-panel"
        role="dialog"
        aria-label="Обратный звонок"
      >
        <template v-if="!done">
          <p class="callback-title">Перезвоним за 5 минут</p>
          <form class="callback-form" novalidate @submit.prevent="submit">
            <input
              v-model="form.name"
              class="input"
              type="text"
              autocomplete="name"
              placeholder="Ваше имя"
            />
            <input
              v-model="form.phone"
              class="input"
              type="tel"
              autocomplete="tel"
              placeholder="+7 (000) 000-00-00"
            />
            <p v-if="error" class="callback-error">{{ error }}</p>
            <button class="btn" type="submit">
              <AppIcon name="phone" :size="20" />
              Позвоните мне
            </button>
          </form>
        </template>
        <div v-else class="callback-done">
          <AppIcon name="check" :size="32" />
          <p class="callback-title">Спасибо! Скоро перезвоним.</p>
          <button class="callback-again" type="button" @click="reset">Отправить ещё</button>
        </div>
      </div>
    </Transition>
    <button
      class="callback-fab"
      type="button"
      :aria-expanded="open"
      aria-controls="callback-panel"
      aria-label="Заказать обратный звонок"
      @click="toggle"
    >
      <AppIcon :name="open ? 'check' : 'phone'" :size="26" />
    </button>
  </div>
</template>

<style scoped lang="scss">
.callback {
  position: fixed;
  top: 50%;
  right: var(--gutter);
  z-index: 50;
  display: none;
  transform: translateY(-50%);

  // Только десктоп.
  @media (width >= 1024px) {
    display: block;
  }

  &-fab {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 56px;
    height: 56px;
    padding: 0;
    border: 0;
    border-radius: $radius-pill;
    background: var(--accent);
    color: $white;
    cursor: pointer;
    box-shadow: 0 6px 18px rgb(31 58 61 / 25%);
    transition: background 0.2s;

    &:hover {
      background: var(--ink);
    }
  }

  &-panel {
    position: absolute;
    top: 50%;
    right: calc(100% + 14px);
    width: 300px;
    padding: 20px;
    box-sizing: border-box;
    border-radius: 20px;
    border: 2px solid var(--card-border);
    background: $white;
    box-shadow: 0 10px 30px rgb(31 58 61 / 20%);
    transform: translateY(-50%);
    transform-origin: right center;
  }

  &-title {
    margin: 0 0 14px;
    font-family: $font-head;
    font-weight: 800;
    font-size: 18px;
    color: var(--ink);
  }

  &-form {
    display: flex;
    flex-direction: column;
    gap: 10px;

    .input {
      min-height: 46px;
    }
  }

  &-error {
    margin: 0;
    font-size: 14px;
    color: #b3402a;
  }

  &-done {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    color: var(--accent);

    .callback-title {
      margin: 8px 0 10px;
    }
  }

  &-again {
    border: 0;
    background: none;
    color: var(--accent);
    font-weight: 700;
    text-decoration: underline;
    cursor: pointer;
  }
}

.callback-pop-enter-active,
.callback-pop-leave-active {
  transition:
    opacity 0.2s,
    scale 0.2s;
}

.callback-pop-enter-from,
.callback-pop-leave-to {
  opacity: 0;
  scale: 0.92;
}

@include reduced-motion {
  .callback-pop-enter-active,
  .callback-pop-leave-active,
  .callback-fab {
    transition: none;
  }
}
</style>
