<script setup lang="ts">
import IconBadge from './IconBadge.vue'
import { SERVICES, formatPrice } from '../data/salon'
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
        <article v-for="s in SERVICES" :key="s.id" class="service">
          <IconBadge :icon="s.icon" :tint="s.tint" />
          <h3 class="h3">{{ s.name }}</h3>
          <p>{{ s.text }}</p>
          <div class="meta">
            <span class="price">{{ formatPrice(s.price) }}</span>
            <span class="note">{{ s.dur }} · {{ s.who }}</span>
          </div>
        </article>
      </div>
    </div>
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
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
}

.service {
  flex: 1 1 320px;
  min-width: 0;
  background: $white;
  border-radius: 28px;
  padding: 28px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  box-sizing: border-box;
}

.service p {
  margin: 0;
  flex: 1;
  line-height: 1.55;
  color: var(--muted);
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
