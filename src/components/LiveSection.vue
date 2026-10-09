<script setup>
import { computed, ref } from 'vue'
import AppIcon from './AppIcon.vue'
import CamBath from './CamBath.vue'
import CamTable from './CamTable.vue'
import CamRest from './CamRest.vue'
import { CAMS } from '../data/salon'

const VIEWS = [CamBath, CamTable, CamRest]

const camIndex = ref(0)
const playing = ref(true)

const cam = computed(() => CAMS[camIndex.value])
const toggleLabel = computed(() =>
  playing.value ? 'Поставить трансляцию на паузу' : 'Продолжить трансляцию')
</script>

<template>
  <section id="live" class="section section--panel panel">
    <div class="container stack-40">
      <div class="section-head">
        <h2 class="h2">Прямой эфир из салона</h2>
        <p>Камеры работают в часы приёма. Смотрите, как проходит груминг, и не волнуйтесь за питомца.</p>
      </div>

      <div class="layout">
        <div class="player-col">
          <div class="player">
            <component :is="VIEWS[camIndex]" />

            <div class="live-badge"><span class="dot" />В эфире</div>

            <button
              v-if="!playing" type="button" class="resume hov on-dark"
              aria-label="Продолжить трансляцию" @click="playing = true"
            >
              <span><AppIcon name="play" :size="36" /></span>
            </button>

            <div class="bar">
              <button type="button" class="toggle hov on-dark" :aria-label="toggleLabel" @click="playing = !playing">
                <AppIcon :name="playing ? 'pause' : 'play'" :size="20" />
              </button>
              <span>{{ cam.title }}</span>
            </div>
          </div>
        </div>

        <div class="cams">
          <h3 class="h3">Камеры</h3>
          <button
            v-for="(c, i) in CAMS" :key="c.id" type="button"
            class="choice cam hov" :class="{ active: i === camIndex }"
            :aria-pressed="i === camIndex" @click="camIndex = i"
          >
            <span class="cam-name">{{ c.name }}</span>
            <span class="cam-desc">{{ c.desc }}</span>
          </button>
          <p class="hint">Эфир идёт, пока в зале работает мастер. Запись трансляции не ведётся.</p>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.panel { background: var(--sky); }
.panel :deep(.section-head) { max-width: 680px; }
.panel :deep(.section-head p) { color: #3B5A66; }
.layout { display: flex; flex-wrap: wrap; gap: 24px; align-items: flex-start; }
.player-col { flex: 3 1 480px; min-width: 0; }
.player {
  position: relative; width: 100%; aspect-ratio: 16 / 9;
  border-radius: 32px; overflow: hidden; background: #CFE9F5;
}
.live-badge {
  position: absolute; top: 16px; left: 16px; display: flex; align-items: center; gap: 8px;
  padding: 6px 14px 6px 12px; border-radius: 999px; background: #C8402C; color: #fff;
  font-weight: 800; font-size: 13px; letter-spacing: .06em; text-transform: uppercase;
}
.dot { width: 9px; height: 9px; border-radius: 50%; background: #fff; animation: pulse 1.6s ease-in-out infinite; }
@keyframes pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: .35; transform: scale(.7); } }

.resume {
  position: absolute; inset: 0; width: 100%; height: 100%; border: 0; cursor: pointer;
  background: rgba(31, 58, 61, .45); display: flex; align-items: center; justify-content: center;
}
.resume span {
  width: 84px; height: 84px; border-radius: 50%; background: var(--sun); color: var(--ink);
  display: flex; align-items: center; justify-content: center;
}
.bar {
  position: absolute; left: 14px; right: 14px; bottom: 14px; display: flex; align-items: center; gap: 12px;
  padding: 6px 18px 6px 6px; border-radius: 999px; background: rgba(31, 58, 61, .78); color: #fff;
  font-weight: 700; font-size: 15px;
}
.bar span { min-width: 0; }
.toggle {
  width: 44px; height: 44px; flex: none; border-radius: 50%; border: 0; cursor: pointer;
  background: #fff; color: var(--ink); display: flex; align-items: center; justify-content: center;
}

.cams { flex: 1 1 280px; min-width: 0; display: flex; flex-direction: column; gap: 12px; }
.cams .h3 { margin-bottom: 4px; }
.cam {
  display: flex; flex-direction: column; align-items: flex-start; gap: 2px;
  padding: 16px 20px; border-radius: 24px; background: rgba(255, 255, 255, .45); border-color: transparent;
}
.cam.active { background: #fff; border-color: var(--ink); color: var(--ink); }
.cam-name { font-weight: 800; font-size: 17px; }
.cam-desc { font-size: 14px; color: var(--muted); }
.hint { margin: 8px 0 0; font-size: 14px; line-height: 1.5; color: #3B5A66; }

@media (prefers-reduced-motion: reduce) { .dot { animation: none; } }
</style>
