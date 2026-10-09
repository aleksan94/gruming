<script setup lang="ts">
import { computed, ref } from 'vue'
import IconBadge from './IconBadge.vue'
import AppModal from './ui-kit/AppModal.vue'
import ServiceDetails from './ServiceDetails.vue'
import { requestBooking } from '../composables/bookingRequest'
import { SERVICES, formatPrice } from '../data/salon'

const selectedId = ref<string | null>(null)
const selected = computed(() => SERVICES.find((s) => s.id === selectedId.value))
const isOpen = computed({
  get: () => !!selected.value,
  set: (v) => {
    if (!v) selectedId.value = null
  },
})

function book() {
  const id = selectedId.value ?? undefined
  selectedId.value = null
  requestBooking(undefined, id)
}
</script>

<template>
  <section id="services" class="section section--panel panel">
    <div class="container stack-40">
      <div class="section-head">
        <h2 class="h2">Услуги и цены</h2>
        <p>
          Итоговая стоимость зависит от породы, размера и состояния шерсти. Мастер назовёт точную
          сумму при осмотре.
        </p>
      </div>
      <div class="grid">
        <article
          v-for="s in SERVICES"
          :key="s.id"
          class="service"
          tabindex="0"
          role="button"
          :aria-label="`${s.name}: подробнее`"
          @click="selectedId = s.id"
          @keydown.enter.self.prevent="selectedId = s.id"
          @keydown.space.self.prevent="selectedId = s.id"
        >
          <IconBadge :icon="s.icon" :tint="s.tint" />
          <h3 class="h3">{{ s.name }}</h3>
          <p>{{ s.text }}</p>
          <div class="meta">
            <span class="price">{{ formatPrice(s.price) }}</span>
            <span class="note">{{ s.dur }} · {{ s.who }}</span>
          </div>
          <span class="more">Подробнее →</span>
        </article>
      </div>
    </div>
    <AppModal v-model="isOpen" :title="selected?.name">
      <ServiceDetails v-if="selected" :service="selected" />
      <template #footer>
        <button type="button" class="btn btn--block" @click="book">Записаться на услугу</button>
      </template>
    </AppModal>
  </section>
</template>

<style scoped lang="scss">
.panel {
  background: #e3f4ea;
}

.panel :deep(.section-head p) {
  color: #3f5e5f;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  grid-auto-rows: 1fr;
  gap: 24px;
}

.service {
  min-width: 0;
  background: $white;
  border-radius: 28px;
  padding: 28px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  box-sizing: border-box;
  cursor: pointer;
  transition:
    transform 0.15s ease,
    box-shadow 0.15s ease;

  &:hover,
  &:focus-visible {
    transform: translateY(-3px);
    box-shadow: 0 12px 28px rgb(31 58 61 / 12%);
  }
}

.more {
  color: var(--accent);
  font-weight: 800;
  font-size: 15px;
}

.service p {
  margin: 0;
  flex: 1;
  line-height: 1.55;
  color: var(--muted);
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  overflow: hidden;
}

.meta {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: baseline;
  gap: 6px 12px;
}

.price {
  font-weight: 800;
  font-size: 20px;
}

.note {
  color: var(--muted);
  font-size: 15px;
}
</style>
