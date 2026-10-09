<script setup lang="ts">
import { ref } from 'vue'
import AppIcon from './AppIcon.vue'
import { EMPLOYEES, petsLabel } from '../data/salon'

const track = ref<HTMLElement | null>(null)

function scrollByCard(dir: 1 | -1) {
  const el = track.value
  if (!el) return
  const card = el.querySelector<HTMLElement>('.person')
  const step = card ? card.offsetWidth + 24 : el.clientWidth
  el.scrollBy({ left: dir * step, behavior: 'smooth' })
}
</script>

<template>
  <section id="team" class="section">
    <div class="container stack-40">
      <div class="section-head">
        <h2 class="h2">Наши мастера</h2>
        <p>Опытные грумеры, которые любят свою работу и находят подход к любому питомцу.</p>
      </div>
      <div class="slider">
        <button type="button" class="nav prev" aria-label="Назад" @click="scrollByCard(-1)">
          <AppIcon name="arrow-up" :size="22" />
        </button>
        <div ref="track" class="grid">
        <article v-for="e in EMPLOYEES" :key="e.id" class="person">
          <div class="photo" :class="`tint-${e.tint}`">
            <img v-if="e.photo" :src="e.photo" :alt="e.name" loading="lazy" />
            <AppIcon v-else name="paw" :size="64" />
          </div>
          <div class="info">
            <h3 class="h3">{{ e.name }}</h3>
            <span class="role">{{ e.role }}</span>
            <span class="pets"><AppIcon name="paw" :size="18" />{{ petsLabel(e.pets) }}</span>
            <p>{{ e.experience }}</p>
            <div class="schedule">
              <ul class="slots">
                <li v-for="s in e.schedule" :key="s.days + s.hours">
                  <AppIcon name="clock" :size="20" />
                  <span class="days">{{ s.days }}</span>
                  <span class="hours">{{ s.hours }}</span>
                </li>
              </ul>
            </div>
          </div>
        </article>
        </div>
        <button type="button" class="nav next" aria-label="Вперёд" @click="scrollByCard(1)">
          <AppIcon name="arrow-up" :size="22" />
        </button>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.slider {
  position: relative;
}

.grid {
  display: flex;
  gap: 24px;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scrollbar-width: none;
  padding: 2px;

  &::-webkit-scrollbar {
    display: none;
  }
}

.nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 1;
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

  &.prev {
    left: -12px;
    svg,
    :deep(svg) {
      transform: rotate(-90deg);
    }
  }

  &.next {
    right: -12px;
    :deep(svg) {
      transform: rotate(90deg);
    }
  }
}

.person {
  flex: 0 0 min(340px, 85%);
  scroll-snap-align: start;
  min-width: 0;
  background: $white;
  border: 2px solid var(--card-border);
  border-radius: 28px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  box-sizing: border-box;
}

.photo {
  aspect-ratio: 4 / 3;
  border-radius: 20px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--ink);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 0 8px 8px;

  p {
    margin: 0;
    flex: 1;
    line-height: 1.55;
    color: var(--muted);
  }
}

.role {
  font-weight: 700;
  color: var(--accent);
}

.pets {
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 700;
  font-size: 15px;
}

.schedule {
  margin-top: 6px;
  padding: 10px 14px;
  border-radius: 16px;
  background: var(--mint);
  font-weight: 700;
  font-size: 15px;
}

.slots {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;

  li {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  li > :first-child {
    flex: none;
  }

  .hours {
    margin-left: auto;
  }

  li + li {
    padding-top: 6px;
    border-top: 1px dashed rgba(0, 0, 0, 0.15);
  }
}

.hours {
  font-variant-numeric: tabular-nums;
}

.tint-peach {
  background: var(--peach);
}

.tint-sky {
  background: var(--sky);
}

.tint-butter {
  background: var(--butter);
}

.tint-mint {
  background: var(--mint);
}

.tint-green {
  background: #cdebdd;
}
</style>
