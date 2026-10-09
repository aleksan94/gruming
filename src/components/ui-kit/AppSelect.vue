<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, useId, watch } from 'vue'
import AppIcon from '../AppIcon.vue'

export interface SelectOption {
  value: string
  label: string
  hint?: string
}

const props = defineProps<{ options: SelectOption[]; id?: string; ariaLabel?: string }>()
const model = defineModel<string>({ required: true })
const emit = defineEmits<{ change: [value: string] }>()

const uid = useId()
const root = ref<HTMLElement | null>(null)
const list = ref<HTMLElement | null>(null)
const open = ref(false)
const active = ref(0)

const listId = `${uid}-list`
const selectedIndex = computed(() => props.options.findIndex((o) => o.value === model.value))
const selected = computed(() => props.options[selectedIndex.value])

function scrollToActive() {
  nextTick(() => {
    list.value?.children[active.value]?.scrollIntoView({ block: 'nearest' })
  })
}

function show() {
  active.value = Math.max(selectedIndex.value, 0)
  open.value = true
  scrollToActive()
}

function hide() {
  open.value = false
}

function choose(i: number) {
  const opt = props.options[i]
  if (!opt) return
  const changed = opt.value !== model.value
  model.value = opt.value
  hide()
  if (changed) emit('change', opt.value)
}

function move(step: number) {
  const n = props.options.length
  active.value = (active.value + step + n) % n
  scrollToActive()
}

function onKey(e: KeyboardEvent) {
  switch (e.key) {
    case 'ArrowDown':
      e.preventDefault()
      if (open.value) move(1)
      else show()
      break
    case 'ArrowUp':
      e.preventDefault()
      if (open.value) move(-1)
      else show()
      break
    case 'Home':
      if (open.value) {
        e.preventDefault()
        active.value = 0
        scrollToActive()
      }
      break
    case 'End':
      if (open.value) {
        e.preventDefault()
        active.value = props.options.length - 1
        scrollToActive()
      }
      break
    case 'Enter':
    case ' ':
      e.preventDefault()
      if (open.value) choose(active.value)
      else show()
      break
    case 'Escape':
      if (open.value) {
        e.preventDefault()
        hide()
      }
      break
    case 'Tab':
      hide()
      break
  }
}

function onOutside(e: PointerEvent) {
  if (!root.value?.contains(e.target as Node)) hide()
}

watch(open, (v) => {
  if (v) document.addEventListener('pointerdown', onOutside)
  else document.removeEventListener('pointerdown', onOutside)
})
onBeforeUnmount(() => document.removeEventListener('pointerdown', onOutside))
</script>

<template>
  <div ref="root" class="select" :class="{ open }">
    <button
      :id="id"
      type="button"
      class="input trigger"
      role="combobox"
      aria-haspopup="listbox"
      :aria-expanded="open"
      :aria-controls="listId"
      :aria-label="ariaLabel"
      :aria-activedescendant="open ? `${uid}-opt-${active}` : undefined"
      @click="open ? hide() : show()"
      @keydown="onKey"
    >
      <span class="value">{{ selected?.label }}</span>
      <svg class="chevron" width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="m6 9 6 6 6-6"
          stroke="currentColor"
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </button>

    <Transition name="pop">
      <ul v-show="open" :id="listId" ref="list" class="menu" role="listbox" tabindex="-1">
        <li
          v-for="(o, i) in options"
          :id="`${uid}-opt-${i}`"
          :key="o.value"
          class="option"
          :class="{ active: i === active, selected: o.value === model }"
          role="option"
          :aria-selected="o.value === model"
          @pointerenter="active = i"
          @click="choose(i)"
        >
          <span class="text">
            <span class="label">{{ o.label }}</span>
            <span v-if="o.hint" class="hint">{{ o.hint }}</span>
          </span>
          <AppIcon v-if="o.value === model" name="check" :size="18" class="tick" />
        </li>
      </ul>
    </Transition>
  </div>
</template>

<style scoped lang="scss">
.select {
  position: relative;
  width: 100%;
}

.trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  text-align: left;
  cursor: pointer;
  transition:
    border-color 0.15s,
    box-shadow 0.15s;

  &:hover,
  .open > & {
    border-color: var(--accent);
  }

  &:focus-visible {
    outline-offset: 2px;
  }
}

.value {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.chevron {
  flex: none;
  color: var(--accent);
  transition: transform 0.2s;

  .open & {
    transform: rotate(180deg);
  }
}

.menu {
  position: absolute;
  z-index: 20;
  top: calc(100% + 8px);
  left: 0;
  right: 0;
  max-height: 280px;
  overflow-y: auto;
  margin: 0;
  padding: 8px;
  list-style: none;
  box-sizing: border-box;
  background: #fff;
  border: 2px solid var(--card-border);
  border-radius: 20px;
  box-shadow: 0 16px 40px rgb(31 58 61 / 16%);
  transform-origin: top;
}

.option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 14px;
  border-radius: 12px;
  color: var(--ink);
  cursor: pointer;

  &.active {
    background: var(--mint);
  }

  &.selected .label {
    font-weight: 800;
  }
}

.text {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.label {
  font-weight: 600;
}

.hint {
  font-size: 14px;
  color: var(--muted);
}

.tick {
  flex: none;
  color: var(--accent);
}

.pop-enter-active,
.pop-leave-active {
  transition:
    opacity 0.15s,
    transform 0.15s;

  @include reduced-motion {
    transition: none;
  }
}

.pop-enter-from,
.pop-leave-to {
  opacity: 0;
  transform: translateY(-6px) scale(0.98);
}
</style>
