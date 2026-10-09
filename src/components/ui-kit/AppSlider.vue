<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import AppIcon from '../AppIcon.vue'

export type SliderArrows =
  'sides' | 'top' | 'top-left' | 'top-right' | 'bottom' | 'bottom-left' | 'bottom-right'

const props = withDefaults(defineProps<{ arrows?: SliderArrows; loop?: boolean }>(), {
  arrows: 'sides',
  loop: false,
})

const GAP = 24
const EDGE = 2

const track = ref<HTMLElement | null>(null)
const atStart = ref(true)
const atEnd = ref(true)
const scrollable = ref(false)

function update() {
  const el = track.value
  if (!el) return
  scrollable.value = el.scrollWidth - el.clientWidth > EDGE
  atStart.value = el.scrollLeft <= EDGE
  atEnd.value = el.scrollLeft + el.clientWidth >= el.scrollWidth - EDGE
}

function scrollByCard(dir: 1 | -1) {
  const el = track.value
  if (!el) return
  if (props.loop && dir === 1 && atEnd.value) {
    el.scrollTo({ left: 0, behavior: 'smooth' })
    return
  }
  if (props.loop && dir === -1 && atStart.value) {
    el.scrollTo({ left: el.scrollWidth, behavior: 'smooth' })
    return
  }
  const card = el.firstElementChild as HTMLElement | null
  const step = card ? card.offsetWidth + GAP : el.clientWidth
  el.scrollBy({ left: dir * step, behavior: 'smooth' })
}

let observer: ResizeObserver | undefined

onMounted(() => {
  update()
  if (track.value) {
    observer = new ResizeObserver(update)
    observer.observe(track.value)
  }
})

onBeforeUnmount(() => observer?.disconnect())
</script>

<template>
  <div class="slider" :class="`arrows-${arrows}`">
    <div ref="track" class="track" @scroll.passive="update">
      <slot />
    </div>
    <div class="controls">
      <button
        type="button"
        class="nav"
        aria-label="Назад"
        :disabled="!scrollable || (!loop && atStart)"
        @click="scrollByCard(-1)"
      >
        <AppIcon name="arrow-up" :size="22" class="back" />
      </button>
      <button
        type="button"
        class="nav"
        aria-label="Вперёд"
        :disabled="!scrollable || (!loop && atEnd)"
        @click="scrollByCard(1)"
      >
        <AppIcon name="arrow-up" :size="22" class="forward" />
      </button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.slider {
  position: relative;
  flex-shrink: 0;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.track {
  --slides: 3;
  --gap: 24px;

  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: calc((100% - (var(--slides) - 1) * var(--gap)) / var(--slides));
  gap: var(--gap);
  min-width: 0;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }

  :slotted(*) {
    min-width: 0;
    scroll-snap-align: start;
  }

  @media (width <= 1000px) {
    --slides: 2;
  }

  @media (width <= 640px) {
    --slides: 1.15;
  }
}

.controls {
  display: flex;
  gap: 12px;
}

.nav {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 2px solid var(--card-border);
  background: $white;
  color: var(--ink);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  &:disabled {
    opacity: 0.4;
    cursor: default;
  }

  .back {
    transform: rotate(-90deg);
  }

  .forward {
    transform: rotate(90deg);
  }
}

/* Стрелки над / под лентой */
[class*='arrows-top'] .controls {
  order: -1;
  margin-bottom: 24px;
}

[class*='arrows-bottom'] .controls {
  margin-top: 24px;
}

.arrows-top .controls,
.arrows-bottom .controls {
  justify-content: center;
}

.arrows-top-left .controls,
.arrows-bottom-left .controls {
  justify-content: flex-start;
}

.arrows-top-right .controls,
.arrows-bottom-right .controls {
  justify-content: flex-end;
}

/* Стрелки по бокам, по центру ленты */
.arrows-sides .controls {
  position: absolute;
  inset: 0;
  justify-content: space-between;
  align-items: center;
  margin: 0 -12px;
  pointer-events: none;

  .nav {
    pointer-events: auto;
  }
}
</style>
