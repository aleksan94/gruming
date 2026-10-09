<script setup lang="ts">
import { computed, ref } from 'vue'
import AppIcon from './AppIcon.vue'
import AppInput from './ui-kit/AppInput.vue'
import AppModal from './ui-kit/AppModal.vue'
import MasterDetails from './MasterDetails.vue'
import AppSlider from './ui-kit/AppSlider.vue'
import { requestBooking } from '../composables/bookingRequest'
import { textMatch } from '../composables/textMatch'
import { EMPLOYEES, petsLabel } from '../data/salon'

const query = ref('')
const shown = computed(() =>
  EMPLOYEES.filter((e) => textMatch(query.value, e.name, e.role, e.experience)),
)

const selectedId = ref<string | null>(null)
const selected = computed(() => EMPLOYEES.find((e) => e.id === selectedId.value))
const isOpen = computed({
  get: () => !!selected.value,
  set: (v) => {
    if (!v) selectedId.value = null
  },
})

function book(id: string) {
  selectedId.value = null
  requestBooking(id)
}
</script>

<template>
  <section id="team" class="section">
    <div class="container stack-40">
      <div class="section-bar">
        <div class="section-head">
          <h2 class="h2">Наши мастера</h2>
          <p>Опытные грумеры, которые любят свою работу и находят подход к любому питомцу.</p>
        </div>
        <AppInput
          v-model="query"
          icon="search"
          type="search"
          class="section-search"
          placeholder="Найти мастера"
          aria-label="Поиск мастера"
          autocomplete="off"
        />
      </div>
      <p v-if="!shown.length" class="empty">Ничего не найдено — попробуйте другое слово.</p>
      <AppSlider v-else arrows="bottom" :loop="false">
        <article v-for="e in shown" :key="e.id" class="person">
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
            <button type="button" class="btn btn--outline hov book" @click="selectedId = e.id">
              Подробнее о мастере
            </button>
            <button type="button" class="btn hov" @click="requestBooking(e.id)">
              Записаться к мастеру
            </button>
          </div>
        </article>
      </AppSlider>
    </div>
    <AppModal v-model="isOpen" :title="selected?.name">
      <MasterDetails v-if="selected" :master="selected" />
      <template #footer>
        <button type="button" class="btn btn--block" @click="selected && book(selected.id)">
          Записаться к мастеру
        </button>
      </template>
    </AppModal>
  </section>
</template>

<style scoped lang="scss">
.empty {
  margin: 0;
  color: var(--muted);
  font-size: 18px;
}

.person {
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

.btn {
  cursor: pointer;
}

.book {
  margin-top: 8px;
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
    border-top: 1px dashed rgb(0 0 0 / 15%);
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
