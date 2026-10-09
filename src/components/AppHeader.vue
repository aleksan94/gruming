<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import PawLogo from './PawLogo.vue'
import { NAV } from '../data/salon'

const open = ref(false)
const hidden = ref(false)
const scrolled = ref(false)
let lastY = 0

const close = () => {
  open.value = false
}

const onKey = (e: KeyboardEvent) => {
  if (e.key === 'Escape') close()
}

watch(open, (v) => {
  if (v) document.addEventListener('keydown', onKey)
  else document.removeEventListener('keydown', onKey)
})

// Шапка прячется при скролле вниз и возвращается при скролле вверх
const onScroll = () => {
  const y = Math.max(window.scrollY, 0)
  scrolled.value = y > 8
  if (open.value || Math.abs(y - lastY) < 6) return
  hidden.value = y > lastY && y > 80
  lastY = y
}

onMounted(() => {
  lastY = window.scrollY
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
})

onBeforeUnmount(() => {
  document.removeEventListener('keydown', onKey)
  window.removeEventListener('scroll', onScroll)
})
</script>

<template>
  <header class="section header" :class="{ 'is-hidden': hidden && !open, 'is-scrolled': scrolled }">
    <div class="container bar">
      <a href="#top" class="brand" @click="close"><PawLogo /><span>Тёплая лапка</span></a>

      <button
        type="button"
        class="burger"
        :class="{ 'is-open': open }"
        :aria-expanded="open"
        aria-controls="site-menu"
        :aria-label="open ? 'Закрыть меню' : 'Открыть меню'"
        @click="open = !open"
      >
        <span /><span /><span />
      </button>

      <div id="site-menu" class="menu" :class="{ 'is-open': open }">
        <nav aria-label="Разделы сайта">
          <a v-for="l in NAV" :key="l.href" :href="l.href" class="lnk" @click="close">{{
            l.label
          }}</a>
        </nav>
        <a href="#booking" class="btn hov" @click="close">Записаться</a>
      </div>
    </div>
  </header>
</template>

<style scoped lang="scss">
.header {
  position: relative;
  padding-block: 20px;
}

.bar {
  display: flex;
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

.menu {
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: space-between;
  gap: 28px;
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

.burger {
  display: none;
  position: relative;
  z-index: 2;
  width: 48px;
  height: 48px;
  padding: 0;
  border: 2px solid var(--border);
  border-radius: 50%;
  background: #fff;
  cursor: pointer;
  transition: background-color 0.2s;

  span {
    position: absolute;
    left: 13px;
    width: 18px;
    height: 2.5px;
    border-radius: 2px;
    background: var(--ink);
    transition:
      transform 0.25s ease,
      opacity 0.2s ease,
      top 0.25s ease;

    &:nth-child(1) {
      top: 14px;
    }

    &:nth-child(2) {
      top: 20px;
    }

    &:nth-child(3) {
      top: 26px;
    }
  }

  &.is-open {
    background: var(--mint);

    span:nth-child(1) {
      top: 20px;
      transform: rotate(45deg);
    }

    span:nth-child(2) {
      opacity: 0;
    }

    span:nth-child(3) {
      top: 20px;
      transform: rotate(-45deg);
    }
  }
}

@media (width <= 760px) {
  .header {
    position: sticky;
    top: 0;
    z-index: 40;
    padding-block: 10px;
    background: rgb(246 251 248 / 80%);
    backdrop-filter: blur(14px) saturate(1.4);
    border-bottom: 1px solid transparent;
    transition:
      transform 0.3s ease,
      border-color 0.2s,
      box-shadow 0.2s;

    &.is-scrolled {
      border-bottom-color: var(--card-border);
      box-shadow: 0 6px 20px rgb(31 58 61 / 6%);
    }

    &.is-hidden {
      transform: translateY(-100%);
    }
  }

  .burger {
    display: block;
  }

  .menu {
    position: absolute;
    top: calc(100% + 4px);
    left: var(--gutter);
    right: var(--gutter);
    z-index: 1;
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
    padding: 20px;
    border: 2px solid var(--card-border);
    border-radius: 28px;
    background: #fff;
    box-shadow: 0 16px 40px rgb(31 58 61 / 14%);
    opacity: 0;
    visibility: hidden;
    transform: translateY(-8px);
    transition:
      opacity 0.2s ease,
      transform 0.2s ease,
      visibility 0.2s;

    &.is-open {
      opacity: 1;
      visibility: visible;
      transform: none;
    }
  }

  nav {
    flex-direction: column;
    align-items: stretch;
    gap: 0;
  }

  .lnk {
    padding: 14px 8px;
    font-size: 18px;
    border-bottom: 1px solid var(--card-border);

    &:last-child {
      border-bottom: 0;
    }
  }

  .menu .btn {
    text-align: center;
  }
}

@media (prefers-reduced-motion: reduce) {
  .header,
  .burger span,
  .menu {
    transition: none;
  }
}
</style>
