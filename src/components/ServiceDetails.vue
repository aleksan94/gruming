<script setup lang="ts">
import AppIcon from './AppIcon.vue'
import IconBadge from './IconBadge.vue'
import { type Service, formatPrice } from '../data/salon'

defineProps<{ service: Service }>()
</script>

<template>
  <div class="details">
    <header class="head" :class="`tint-${service.tint}`">
      <IconBadge :icon="service.icon" :tint="service.tint" :size="64" class="badge" />
      <h3 class="h3 title">{{ service.name }}</h3>
      <div class="chips">
        <span class="chip"><AppIcon name="clock" :size="16" /> {{ service.dur }}</span>
        <span class="chip"><AppIcon name="paw" :size="16" /> {{ service.who }}</span>
      </div>
    </header>

    <div class="content">
      <p class="lead">{{ service.text }}</p>
      <p class="more">{{ service.more }}</p>

      <h4 class="sub">Что входит</h4>
      <ul class="list">
        <li v-for="item in service.includes" :key="item">
          <span class="tick"><AppIcon name="check" :size="14" /></span>
          {{ item }}
        </li>
      </ul>

      <p class="note">{{ service.note }}</p>

      <div class="price">
        <span>Стоимость</span>
        <strong>{{ formatPrice(service.price) }}</strong>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.head {
  padding: 32px 28px 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  background: var(--mint);

  &.tint-sky {
    background: var(--sky);
  }

  &.tint-peach {
    background: var(--peach);
  }

  &.tint-butter {
    background: var(--butter);
  }

  &.tint-green {
    background: #cdebdd;
  }
}

.badge {
  background: $white !important;
}

.title {
  margin: 0;
}

.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: $radius-pill;
  background: rgb(255 255 255 / 75%);
  font-size: 14px;
  font-weight: 700;
}

.content {
  padding: 24px 28px 28px;
  display: flex;
  flex-direction: column;
  gap: 14px;

  p {
    margin: 0;
    line-height: 1.6;
  }
}

.lead {
  font-weight: 700;
}

.more {
  color: var(--muted);
}

.sub {
  margin: 6px 0 0;
  font-family: var(--font-head);
  font-size: 18px;
}

.list {
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 10px;

  li {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    line-height: 1.45;
  }
}

.tick {
  flex: none;
  width: 22px;
  height: 22px;
  margin-top: 1px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: var(--mint);
  color: var(--accent);
}

.note {
  padding: 14px 16px;
  border-radius: 16px;
  background: var(--butter);
  font-size: 15px;
}

.price {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  padding-top: 14px;
  border-top: 1px dashed var(--border);

  span {
    color: var(--muted);
  }

  strong {
    font-size: 24px;
    font-weight: 800;
  }
}
</style>
