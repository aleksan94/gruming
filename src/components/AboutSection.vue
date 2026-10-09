<script setup lang="ts">
import AppIcon from './AppIcon.vue'
import { ADVANTAGES } from '../data/salon'
</script>

<template>
  <section id="about" class="section">
    <div class="container row">
      <div class="text">
        <h2 class="h2">Здесь не страшно</h2>
        <p>Мы принимаем одного питомца за раз и никуда не торопимся. Если нужно, делаем перерыв, даём воды и возвращаемся к процессу, когда хвост снова спокоен.</p>
        <p>Всё, что происходит в зале, можно посмотреть онлайн. Вы видите, что с питомцем всё хорошо, и приходите за ним к назначенному времени.</p>
      </div>
      <div class="cards">
        <div v-for="a in ADVANTAGES" :key="a.title" class="card-item" :class="`tint-${a.tint}`">
          <AppIcon :name="a.icon" :size="32" />
          <h3>{{ a.title }}</h3>
          <p>{{ a.text }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.row { display: flex; flex-wrap: wrap; align-items: flex-start; gap: 40px 56px; }
.text { flex: 1 1 360px; min-width: 0; display: flex; flex-direction: column; gap: 20px; }
.text p { margin: 0; font-size: 18px; line-height: 1.65; color: var(--muted); }
.cards { flex: 1.4 1 420px; min-width: 0; display: flex; flex-wrap: wrap; gap: 16px; }
.card-item {
  flex: 1 1 220px; min-width: 0; border-radius: 28px; padding: 24px;
  display: flex; flex-direction: column; gap: 10px; box-sizing: border-box;
}
.card-item h3 { margin: 0; font-family: var(--font-head); font-weight: 700; font-size: 18px; line-height: 1.3; }
.card-item p { margin: 0; line-height: 1.55; color: var(--muted); }
.tint-peach { background: var(--peach); }
.tint-sky { background: var(--sky); }
.tint-butter { background: var(--butter); }
.tint-mint { background: var(--mint); }
</style>
