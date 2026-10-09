<script setup lang="ts">
import AppIcon from './AppIcon.vue'
import { type Employee, petsLabel } from '../data/salon'

defineProps<{ master: Employee }>()
</script>

<template>
  <div class="details">
    <header class="head" :class="`tint-${master.tint}`">
      <div class="photo">
        <img v-if="master.photo" :src="master.photo" :alt="master.name" />
        <AppIcon v-else name="paw" :size="48" />
      </div>
      <div class="who">
        <h3 class="h3 name">{{ master.name }}</h3>
        <span class="role">{{ master.role }}</span>
        <span class="chip"><AppIcon name="paw" :size="16" /> {{ petsLabel(master.pets) }}</span>
      </div>
    </header>

    <div class="content">
      <p class="lead">{{ master.experience }}</p>
      <p class="about">{{ master.about }}</p>

      <h4 class="sub">Специализация</h4>
      <ul class="list">
        <li v-for="item in master.specialties" :key="item">
          <span class="tick"><AppIcon name="check" :size="14" /></span>
          {{ item }}
        </li>
      </ul>

      <h4 class="sub">График работы</h4>
      <ul class="slots">
        <li v-for="s in master.schedule" :key="s.days + s.hours">
          <AppIcon name="clock" :size="20" />
          <span>{{ s.days }}</span>
          <span class="hours">{{ s.hours }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped lang="scss">
.head {
  padding: 32px 72px 24px 28px;
  display: flex;
  align-items: center;
  gap: 20px;
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

.photo {
  flex: none;
  width: 96px;
  height: 96px;
  border-radius: 50%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: $white;
  color: var(--ink);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.who {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 6px;
  min-width: 0;
}

.name {
  margin: 0;
}

.role {
  font-weight: 700;
  color: var(--accent);
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

.about {
  color: var(--muted);
}

.sub {
  margin: 6px 0 0;
  font-family: var(--font-head);
  font-size: 18px;
}

.list,
.slots {
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

.slots {
  padding: 12px 16px;
  border-radius: 16px;
  background: var(--mint);
  font-weight: 700;
  font-size: 15px;

  li {
    align-items: center;
  }

  .hours {
    margin-left: auto;
    font-variant-numeric: tabular-nums;
  }
}

@media (width <= 480px) {
  .head {
    flex-direction: column;
    align-items: flex-start;
    padding-right: 28px;
  }
}
</style>
