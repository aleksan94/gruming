<script setup lang="ts">
import PawLogo from './PawLogo.vue'
import { NAV } from '../data/salon'
</script>

<template>
  <footer class="section footer">
    <div class="container bar">
      <div class="brand"><PawLogo :size="40" /><span>Тёплая лапка</span></div>
      <nav aria-label="Разделы в подвале">
        <a v-for="l in NAV" :key="l.href" :href="l.href" class="lnk">{{ l.label }}</a>
      </nav>
      <span class="copy">© Тёплая лапка</span>
    </div>
  </footer>
</template>

<style scoped lang="scss">
.footer {
  background: var(--ink);
  color: #fff;
  padding-block: 40px;
}

.bar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 20px 32px;
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
}

.brand span {
  font-family: var(--font-head);
  font-weight: 700;
  font-size: 20px;
}

nav {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 24px;
  font-weight: 700;
  font-size: 15px;
}

.lnk {
  color: #fff;
  text-decoration: none;
}

.lnk:hover {
  text-decoration: underline;
  text-underline-offset: 6px;
}

.lnk:focus-visible {
  outline-color: var(--sun);
}

.copy {
  font-size: 14px;
  color: #bfd8d2;
}
</style>
