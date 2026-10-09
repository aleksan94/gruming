<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import AppIcon from './AppIcon.vue'
import AppSelect from './ui-kit/AppSelect.vue'
import { bookingRequest } from '../composables/bookingRequest'
import { type PetId, SERVICES, PETS, EMPLOYEES, TIMES, FIRST_HOUR, worksAt, formatPrice } from '../data/salon'

const WEEKDAYS = ['вс', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб']
const MONTHS = [
  'января',
  'февраля',
  'марта',
  'апреля',
  'мая',
  'июня',
  'июля',
  'августа',
  'сентября',
  'октября',
  'ноября',
  'декабря',
]
const DAYS_AHEAD = 7

const now = new Date()
const days = Array.from({ length: DAYS_AHEAD }, (_, i) => {
  const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() + i)
  const wd = WEEKDAYS[d.getDay()]
  return {
    weekday: d.getDay(),
    wd: i === 0 ? 'сегодня' : wd,
    num: d.getDate(),
    label: `${wd}, ${d.getDate()} ${MONTHS[d.getMonth()]}`,
  }
})

const serviceId = ref('bath')
const petId = ref('dog')
const masterId = ref('any')
const dayIndex = ref(1)
const time = ref<string | null>('12:00')
const contact = reactive({ name: '', phone: '' })
const error = ref('')
const done = ref(false)

const service = computed(() => SERVICES.find((s) => s.id === serviceId.value)!)
const pet = computed(() => PETS.find((p) => p.id === petId.value)!)
const master = computed(() => EMPLOYEES.find((e) => e.id === masterId.value))
// Мастера, которые работают с выбранным животным.
const suitable = computed(() => EMPLOYEES.filter((e) => e.pets.includes(petId.value as PetId)))
const masterOptions = computed(() => [
  { value: 'any', label: 'Любой мастер' },
  ...suitable.value.map((e) => ({ value: e.id, label: e.name, hint: e.role })),
])
const masterText = computed(() => master.value?.name ?? 'Любой мастер')
const dateText = computed(() => days[dayIndex.value].label)

// Часть слотов «занята» (имитация расписания); сегодня прошедшие часы тоже недоступны.
function slotState(dIdx: number, i: number, mId: string) {
  const hour = FIRST_HOUR + i
  const m = EMPLOYEES.find((e) => e.id === mId)
  const past = dIdx === 0 && hour <= now.getHours()
  const staff = m ? [m] : suitable.value
  const works = staff.some((e) => worksAt(e, days[dIdx].weekday, hour))
  const shift = EMPLOYEES.findIndex((e) => e.id === mId) + 1
  const off = !past && !works
  const busy = past || (works && (dIdx * 5 + i * 7 + shift * 3) % 4 === 0)
  return { busy, off }
}

const slots = computed(() =>
  TIMES.map((t, i) => ({ time: t, ...slotState(dayIndex.value, i, masterId.value) })),
)

// Состояние дня: 'off' — мастер не работает, 'full' — работает, но все слоты заняты.
const dayStates = computed(() =>
  days.map((d, dIdx) => {
    const staff = master.value ? [master.value] : suitable.value
    const works = TIMES.some((_, i) => staff.some((e) => worksAt(e, d.weekday, FIRST_HOUR + i)))
    if (!works) return 'off' as const
    const hasFree = TIMES.some((_, i) => {
      const st = slotState(dIdx, i, masterId.value)
      return !st.busy && !st.off
    })
    return hasFree ? ('ok' as const) : ('full' as const)
  }),
)
const DAY_TIPS = { off: 'Мастер в этот день не работает', full: 'Все время занято', ok: undefined }

function pickPet(id: string) {
  petId.value = id
  if (master.value && !master.value.pets.includes(id as PetId)) masterId.value = 'any'
  pickMaster()
}

function pickMaster() {
  time.value = null
  if (dayStates.value[dayIndex.value] !== 'ok') {
    const first = dayStates.value.indexOf('ok')
    if (first >= 0) dayIndex.value = first
  }
}

// Выбирает мастера и ближайшие свободные день и время.
function selectMaster(id: string) {
  const m = EMPLOYEES.find((e) => e.id === id)
  if (!m) return
  if (!m.pets.includes(petId.value as PetId)) petId.value = m.pets[0]
  masterId.value = id
  for (let d = 0; d < days.length; d++) {
    const i = TIMES.findIndex((_, k) => {
      const st = slotState(d, k, id)
      return !st.busy && !st.off
    })
    if (i >= 0) {
      dayIndex.value = d
      time.value = TIMES[i]
      return
    }
  }
  pickMaster()
}

watch(bookingRequest, (r) => r && selectMaster(r.masterId))

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
                v-for="s in SERVICES"
                :key="s.id"
                type="button"
                class="choice hov service"
                :aria-pressed="s.id === serviceId"
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
                v-for="p in PETS"
                :key="p.id"
                type="button"
                class="choice hov pet"
                :aria-pressed="p.id === petId"
                @click="pickPet(p.id)"
              >
                {{ p.name }}
              </button>
            </div>
          </div>

          <div class="step">
            <h3 class="step-title"><span class="num">3</span>Мастер</h3>
            <div class="field">
              <AppSelect
                id="b-master"
                v-model="masterId"
                :options="masterOptions"
                aria-label="Мастер"
                @change="pickMaster"
              />
            </div>
          </div>

          <div class="step">
            <h3 class="step-title"><span class="num">4</span>День</h3>
            <div class="row gap-8">
              <span
                v-for="(d, i) in days"
                :key="i"
                class="tip-wrap day-wrap"
                :class="{ 'has-tip': dayStates[i] !== 'ok' }"
                :data-tip="DAY_TIPS[dayStates[i]]"
                :tabindex="dayStates[i] !== 'ok' ? 0 : undefined"
              >
                <button
                  type="button"
                  class="choice hov day"
                  :class="{ full: dayStates[i] === 'full' }"
                  :aria-pressed="dayStates[i] === 'ok' && i === dayIndex"
                  :aria-label="d.label"
                  :disabled="dayStates[i] !== 'ok'"
                  @click="pickDay(i)"
                >
                  <span class="day-wd">{{ d.wd }}</span>
                  <span class="day-num">{{ d.num }}</span>
                </button>
              </span>
            </div>
          </div>

          <div class="step">
            <h3 class="step-title"><span class="num">5</span>Время</h3>
            <div class="row gap-8">
              <span
                v-for="s in slots"
                :key="s.time"
                class="tip-wrap slot-wrap"
                :class="{ 'has-tip': s.busy || s.off }"
                :data-tip="s.off ? 'Мастер в это время не работает' : s.busy ? 'Время занято' : undefined"
                :tabindex="s.busy || s.off ? 0 : undefined"
              >
                <button
                  type="button"
                  class="choice hov slot"
                  :class="{ busy: s.busy, off: s.off }"
                  :disabled="s.busy || s.off"
                  :aria-pressed="!s.busy && !s.off && s.time === time"
                  @click="time = s.time"
                >
                  {{ s.time }}
                </button>
              </span>
            </div>
            <p class="hint">
              Зачёркнутое время или день уже заняты, серое с пунктиром — мастер в это время не работает.
            </p>
          </div>

          <div class="step">
            <h3 class="step-title"><span class="num">6</span>Ваши контакты</h3>
            <div class="row gap-16">
              <div class="field contact">
                <label for="b-name">Имя</label>
                <input
                  id="b-name"
                  v-model="contact.name"
                  class="input"
                  type="text"
                  autocomplete="name"
                  placeholder="Как к вам обращаться"
                />
              </div>
              <div class="field contact">
                <label for="b-phone">Телефон</label>
                <input
                  id="b-phone"
                  v-model="contact.phone"
                  class="input"
                  type="tel"
                  autocomplete="tel"
                  placeholder="+7 (000) 000-00-00"
                />
              </div>
            </div>
          </div>
        </div>

        <aside class="summary">
          <div v-if="!done" class="summary-body">
            <h3>Ваша запись</h3>
            <dl>
              <div>
                <dt>Услуга</dt>
                <dd>{{ service.name }}</dd>
              </div>
              <div>
                <dt>Питомец</dt>
                <dd>{{ pet.name }}</dd>
              </div>
              <div>
                <dt>Мастер</dt>
                <dd>{{ masterText }}</dd>
              </div>
              <div>
                <dt>Дата</dt>
                <dd>{{ dateText }}</dd>
              </div>
              <div>
                <dt>Время</dt>
                <dd>{{ time || 'выберите время' }}</dd>
              </div>
              <div>
                <dt>Длительность</dt>
                <dd>{{ service.dur }}</dd>
              </div>
            </dl>
            <hr />
            <div class="total">
              <span>Стоимость</span><strong>{{ formatPrice(service.price) }}</strong>
            </div>
            <p v-if="error" role="alert" class="alert">{{ error }}</p>
            <button type="button" class="submit hov on-dark" @click="book">Записаться</button>
            <p class="fine">
              Оплата после груминга. Отменить или перенести запись можно по телефону.
            </p>
          </div>

          <div v-else class="summary-body">
            <span class="done-icon"><AppIcon name="check" :size="32" /></span>
            <h3>Заявка принята</h3>
            <p class="thanks">
              Ждём вас: {{ dateText }}, {{ time }}. Услуга: {{ service.name }}. Мастер: {{ masterText }}. Администратор
              позвонит по номеру {{ contact.phone }} и подтвердит запись.
            </p>
            <button type="button" class="again hov on-dark" @click="reset">Новая запись</button>
          </div>
        </aside>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.layout {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  align-items: flex-start;
}

/* Шаги */
.steps {
  flex: 3 1 480px;
  min-width: 0;
  gap: 32px;
}

.step {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.step-title {
  margin: 0;
  display: flex;
  align-items: center;
  gap: 12px;
  font-family: var(--font-head);
  font-weight: 700;
  font-size: 20px;
}

.num {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--sun);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-body);
  font-weight: 800;
  font-size: 16px;
}

.row {
  display: flex;
  flex-wrap: wrap;
}

.gap-8 {
  gap: 8px;
}

.gap-10 {
  gap: 10px;
}

.gap-16 {
  gap: 16px;
}

.hint {
  margin: 0;
  font-size: 14px;
  color: var(--muted);
}

.service {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
  padding: 12px 18px;
  border-radius: 20px;
}

.service-name {
  font-weight: 800;
  font-size: 16px;
}

.service-dur {
  font-size: 14px;
  opacity: 0.85;
}

.pet {
  min-height: 48px;
  padding: 0 28px;
  border-radius: $radius-pill;
  font-weight: 800;
  font-size: 16px;
}

.day-wrap {
  flex: 1 1 76px;
}

.day {
  flex: 1 1 auto;
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 10px 6px;
  border-radius: 22px;
}

.day:disabled {
  background: transparent;
  border: 2px dashed #c5d4d0;
  color: #9db1ad;
  cursor: default;
}

.day.full:disabled {
  background: #edf3f0;
  border: 2px solid #edf3f0;
  color: #7c9390;
}

.day.full .day-num {
  text-decoration: line-through;
}

.day-wd {
  font-size: 13px;
  font-weight: 700;
  opacity: 0.85;
}

.day-num {
  font-family: var(--font-head);
  font-weight: 700;
  font-size: 24px;
  line-height: 1.2;
}

.tip-wrap {
  position: relative;
  min-width: 0;
  display: flex;
  outline: none;
}

.slot-wrap {
  flex: 1 1 92px;
}

.tip-wrap.has-tip::after {
  content: attr(data-tip);
  position: absolute;
  bottom: calc(100% + 8px);
  left: 50%;
  transform: translateX(-50%);
  z-index: 5;
  width: max-content;
  max-width: 220px;
  padding: 8px 12px;
  border-radius: 12px;
  background: var(--ink);
  color: $white;
  font-size: 13px;
  font-weight: 700;
  line-height: 1.3;
  text-align: center;
  text-decoration: none;
  pointer-events: none;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.15s;
}

.tip-wrap.has-tip:hover::after,
.tip-wrap.has-tip:focus-visible::after {
  opacity: 1;
  visibility: visible;
}

.slot {
  flex: 1 1 auto;
  min-width: 0;
  min-height: 48px;
  border-radius: 16px;
  font-weight: 800;
  font-size: 16px;
  text-align: center;
}

.slot[aria-pressed='true'] {
  background: var(--accent);
  border-color: var(--accent);
}

.slot.busy {
  background: #edf3f0;
  border-color: #edf3f0;
  color: #7c9390;
  text-decoration: line-through;
  cursor: default;
}

.slot.off {
  background: transparent;
  border: 2px dashed #c5d4d0;
  color: #9db1ad;
  cursor: default;
}

.contact {
  flex: 1 1 220px;
}

/* Сводка */
.summary {
  flex: 2 1 300px;
  min-width: 0;
  box-sizing: border-box;
  background: var(--ink);
  color: $white;
  border-radius: 36px;
  padding: clamp(22px, 3vw, 36px);
}

.summary-body {
  display: flex;
  flex-direction: column;
  gap: 22px;
}

.summary h3 {
  margin: 0;
  font-family: var(--font-head);
  font-weight: 700;
  font-size: 24px;
  line-height: 1.25;
}

dl {
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

dl div,
.total {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 4px 16px;
}

dt,
.total span {
  color: $border-soft;
}

dd {
  margin: 0;
  font-weight: 800;
}

hr {
  width: 100%;
  height: 2px;
  margin: 0;
  border: 0;
  border-radius: 2px;
  background: #35575a;
}

.total {
  align-items: baseline;
}

.total strong {
  font-family: var(--font-head);
  font-weight: 700;
  font-size: 28px;
}

.fine {
  margin: 0;
  font-size: 14px;
  line-height: 1.5;
  color: $border-soft;
}

.thanks {
  margin: 0;
  line-height: 1.6;
  color: #d8e8e4;
}

.submit,
.again {
  min-height: 56px;
  border-radius: $radius-pill;
  font-weight: 800;
  cursor: pointer;
  font-size: 17px;
}

.submit {
  border: 0;
  background: var(--sun);
  color: var(--ink);
}

.again {
  min-height: 52px;
  font-size: 16px;
  border: 2px solid var(--sun);
  background: transparent;
  color: var(--sun);
}

.done-icon {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: var(--sun);
  color: var(--ink);
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
