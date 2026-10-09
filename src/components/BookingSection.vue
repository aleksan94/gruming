<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import AppIcon from './AppIcon.vue'
import { SERVICES, PETS, TIMES, FIRST_HOUR, formatPrice } from '../data/salon'

const WEEKDAYS = ['вс', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб']
const MONTHS = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря']
const DAYS_AHEAD = 7

const now = new Date()
const days = Array.from({ length: DAYS_AHEAD }, (_, i) => {
  const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() + i)
  const wd = WEEKDAYS[d.getDay()]
  return {
    wd: i === 0 ? 'сегодня' : wd,
    num: d.getDate(),
    label: `${wd}, ${d.getDate()} ${MONTHS[d.getMonth()]}`,
  }
})

const serviceId = ref('bath')
const petId = ref('dog')
const dayIndex = ref(1)
const time = ref<string | null>('12:00')
const contact = reactive({ name: '', phone: '' })
const error = ref('')
const done = ref(false)

const service = computed(() => SERVICES.find((s) => s.id === serviceId.value)!)
const pet = computed(() => PETS.find((p) => p.id === petId.value)!)
const dateText = computed(() => days[dayIndex.value].label)

// Часть слотов «занята» (имитация расписания); сегодня прошедшие часы тоже недоступны.
const slots = computed(() => TIMES.map((t, i) => {
  const past = dayIndex.value === 0 && FIRST_HOUR + i <= now.getHours()
  const busy = past || (dayIndex.value * 5 + i * 7) % 4 === 0
  return { time: t, busy }
}))

function pickDay(i: number) {
  dayIndex.value = i
  time.value = null
}

function book() {
  if (!time.value) {
    error.value = 'Выберите свободное время визита.'
  } else if (!contact.name.trim() || !contact.phone.trim()) {
    error.value = 'Укажите имя и телефон, чтобы администратор мог подтвердить запись.'
  } else {
    error.value = ''
    done.value = true
  }
}

function reset() {
  done.value = false
  contact.name = ''
  contact.phone = ''
  time.value = null
  error.value = ''
}
</script>

<template>
  <section id="booking" class="section section--tall">
    <div class="container stack-40">
      <div class="section-head">
        <h2 class="h2">Онлайн-запись</h2>
        <p>Выберите услугу и свободное время. Администратор перезвонит и подтвердит визит.</p>
      </div>

      <div class="layout">
        <div class="card steps">
          <div class="step">
            <h3 class="step-title"><span class="num">1</span>Услуга</h3>
            <div class="row gap-10">
              <button
                v-for="s in SERVICES" :key="s.id" type="button"
                class="choice hov service" :aria-pressed="s.id === serviceId"
                @click="serviceId = s.id"
              >
                <span class="service-name">{{ s.name }}</span>
                <span class="service-dur">{{ s.dur }}</span>
              </button>
            </div>
          </div>

          <div class="step">
            <h3 class="step-title"><span class="num">2</span>Питомец</h3>
            <div class="row gap-10">
              <button
                v-for="p in PETS" :key="p.id" type="button"
                class="choice hov pet" :aria-pressed="p.id === petId"
                @click="petId = p.id"
              >{{ p.name }}</button>
            </div>
          </div>

          <div class="step">
            <h3 class="step-title"><span class="num">3</span>День</h3>
            <div class="row gap-8">
              <button
                v-for="(d, i) in days" :key="i" type="button"
                class="choice hov day" :aria-pressed="i === dayIndex" :aria-label="d.label"
                @click="pickDay(i)"
              >
                <span class="day-wd">{{ d.wd }}</span>
                <span class="day-num">{{ d.num }}</span>
              </button>
            </div>
          </div>

          <div class="step">
            <h3 class="step-title"><span class="num">4</span>Время</h3>
            <div class="row gap-8">
              <button
                v-for="s in slots" :key="s.time" type="button"
                class="choice hov slot" :class="{ busy: s.busy }"
                :disabled="s.busy" :aria-pressed="!s.busy && s.time === time"
                @click="time = s.time"
              >{{ s.time }}</button>
            </div>
            <p class="hint">Зачёркнутое время уже занято.</p>
          </div>

          <div class="step">
            <h3 class="step-title"><span class="num">5</span>Ваши контакты</h3>
            <div class="row gap-16">
              <div class="field contact">
                <label for="b-name">Имя</label>
                <input id="b-name" v-model="contact.name" class="input" type="text" autocomplete="name" placeholder="Как к вам обращаться">
              </div>
              <div class="field contact">
                <label for="b-phone">Телефон</label>
                <input id="b-phone" v-model="contact.phone" class="input" type="tel" autocomplete="tel" placeholder="+7 (000) 000-00-00">
              </div>
            </div>
          </div>
        </div>

        <aside class="summary">
          <div v-if="!done" class="summary-body">
            <h3>Ваша запись</h3>
            <dl>
              <div><dt>Услуга</dt><dd>{{ service.name }}</dd></div>
              <div><dt>Питомец</dt><dd>{{ pet.name }}</dd></div>
              <div><dt>Дата</dt><dd>{{ dateText }}</dd></div>
              <div><dt>Время</dt><dd>{{ time || 'выберите время' }}</dd></div>
              <div><dt>Длительность</dt><dd>{{ service.dur }}</dd></div>
            </dl>
            <hr>
            <div class="total"><span>Стоимость</span><strong>{{ formatPrice(service.price) }}</strong></div>
            <p v-if="error" role="alert" class="alert">{{ error }}</p>
            <button type="button" class="submit hov on-dark" @click="book">Записаться</button>
            <p class="fine">Оплата после груминга. Отменить или перенести запись можно по телефону.</p>
          </div>

          <div v-else class="summary-body">
            <span class="done-icon"><AppIcon name="check" :size="32" /></span>
            <h3>Заявка принята</h3>
            <p class="thanks">
              Ждём вас: {{ dateText }}, {{ time }}. Услуга: {{ service.name }}.
              Администратор позвонит по номеру {{ contact.phone }} и подтвердит запись.
            </p>
            <button type="button" class="again hov on-dark" @click="reset">Новая запись</button>
          </div>
        </aside>
      </div>
    </div>
  </section>
</template>

<style scoped>
.layout { display: flex; flex-wrap: wrap; gap: 24px; align-items: flex-start; }

/* Шаги */
.steps { flex: 3 1 480px; min-width: 0; gap: 32px; }
.step { display: flex; flex-direction: column; gap: 14px; }
.step-title { margin: 0; display: flex; align-items: center; gap: 12px; font-family: var(--font-head); font-weight: 700; font-size: 20px; }
.num {
  width: 32px; height: 32px; border-radius: 50%; background: var(--sun);
  display: flex; align-items: center; justify-content: center; font-family: var(--font-body); font-weight: 800; font-size: 16px;
}
.row { display: flex; flex-wrap: wrap; }
.gap-8 { gap: 8px; }
.gap-10 { gap: 10px; }
.gap-16 { gap: 16px; }
.hint { margin: 0; font-size: 14px; color: var(--muted); }

.service { display: flex; flex-direction: column; align-items: flex-start; gap: 2px; padding: 12px 18px; border-radius: 20px; }
.service-name { font-weight: 800; font-size: 16px; }
.service-dur { font-size: 14px; opacity: .85; }

.pet { min-height: 48px; padding: 0 28px; border-radius: 999px; font-weight: 800; font-size: 16px; }

.day {
  flex: 1 1 76px; min-width: 0; display: flex; flex-direction: column; align-items: center; gap: 2px;
  padding: 10px 6px; border-radius: 22px;
}
.day-wd { font-size: 13px; font-weight: 700; opacity: .85; }
.day-num { font-family: var(--font-head); font-weight: 700; font-size: 24px; line-height: 1.2; }

.slot { flex: 1 1 92px; min-width: 0; min-height: 48px; border-radius: 16px; font-weight: 800; font-size: 16px; text-align: center; }
.slot[aria-pressed="true"] { background: var(--accent); border-color: var(--accent); }
.slot.busy { background: #EDF3F0; border-color: #EDF3F0; color: #7C9390; text-decoration: line-through; cursor: default; }

.contact { flex: 1 1 220px; }

/* Сводка */
.summary {
  flex: 2 1 300px; min-width: 0; box-sizing: border-box; background: var(--ink); color: #fff;
  border-radius: 36px; padding: clamp(22px, 3vw, 36px);
}
.summary-body { display: flex; flex-direction: column; gap: 22px; }
.summary h3 { margin: 0; font-family: var(--font-head); font-weight: 700; font-size: 24px; line-height: 1.25; }
dl { margin: 0; display: flex; flex-direction: column; gap: 14px; }
dl div, .total { display: flex; flex-wrap: wrap; justify-content: space-between; gap: 4px 16px; }
dt, .total span { color: #BFD8D2; }
dd { margin: 0; font-weight: 800; }
hr { width: 100%; height: 2px; margin: 0; border: 0; border-radius: 2px; background: #35575A; }
.total { align-items: baseline; }
.total strong { font-family: var(--font-head); font-weight: 700; font-size: 28px; }
.fine { margin: 0; font-size: 14px; line-height: 1.5; color: #BFD8D2; }
.thanks { margin: 0; line-height: 1.6; color: #D8E8E4; }

.submit, .again { min-height: 56px; border-radius: 999px; font-weight: 800; cursor: pointer; font-size: 17px; }
.submit { border: 0; background: var(--sun); color: var(--ink); }
.again { min-height: 52px; font-size: 16px; border: 2px solid var(--sun); background: transparent; color: var(--sun); }
.done-icon {
  width: 64px; height: 64px; border-radius: 50%; background: var(--sun); color: var(--ink);
  display: flex; align-items: center; justify-content: center;
}
</style>
