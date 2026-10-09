<script setup lang="ts">
import PawLogo from './PawLogo.vue'
import { NAV } from '../data/salon'
</script>

<template>
  <header class="section header">
    <div class="container bar">
      <a href="#top" class="brand"><PawLogo /><span>Тёплая лапка</span></a>
      <nav aria-label="Разделы сайта">
        <a v-for="l in NAV" :key="l.href" :href="l.href" class="lnk">{{ l.label }}</a>
      </nav>
      <a href="#booking" class="btn hov">Записаться</a>
    </div>
  </header>
</template>

<style scoped>
.header {
  padding-block: 20px;
}
.bar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 16px 28px;
}
.brand {
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
}
.brand span {
  font-family: var(--font-head);
  font-weight: 700;
  font-size: 22px;
}
nav {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px 28px;
  font-weight: 700;
}
.lnk {
  text-decoration: none;
}
.lnk:hover {
  text-decoration: underline;
  text-underline-offset: 6px;
}
</style>
