<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import AppIcon from './AppIcon.vue'
import AppInput from './ui-kit/AppInput.vue'
import AppModal from './ui-kit/AppModal.vue'
import CatalogStatus from './CatalogStatus.vue'
import EmptyState from './EmptyState.vue'
import AppPhoneInput from './ui-kit/AppPhoneInput.vue'
import AppSelect from './ui-kit/AppSelect.vue'
import AppTooltip from './ui-kit/AppTooltip.vue'
import { bookingRequest } from '../composables/bookingRequest'
import {
  catalogStatus,
  employees,
  isBusy,
  loadCatalog,
  services,
  submitBooking,
} from '../data/catalog'
import {
  type Employee,
  type PetId,
  PETS,
  TIMES,
  FIRST_HOUR,
  worksAt,
  formatPrice,
} from '../data/salon'

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
const WEEK = 7
const PHONE_DIGITS = 11 // +7 и 10 цифр номера
const WEEKS_AHEAD = 4
const DAYS_AHEAD = WEEK * WEEKS_AHEAD

const now = new Date()
const days = Array.from({ length: DAYS_AHEAD }, (_, i) => {
  const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() + i)
  const wd = WEEKDAYS[d.getDay()]
  return {
    iso: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`,
    weekday: d.getDay(),
    wd: i === 0 ? 'сегодня' : wd,
    num: d.getDate(),
    month: d.getMonth(),
    label: `${wd}, ${d.getDate()} ${MONTHS[d.getMonth()]}`,
  }
})

// Пока пользователь не выбрал услугу, берём первую из каталога.
const serviceId = ref('')
const petId = ref('dog')
const masterId = ref('any')
const dayIndex = ref(1)
const week = ref(0)
const time = ref<string | null>(null)
const contact = reactive({ name: '', phone: '' })
const error = ref('')
const contactError = ref('')
const confirmOpen = ref(false)
const done = ref(false)
const submitting = ref(false)
// Мастер, которого назначили, если пользователь выбрал «Любой мастер».
const bookedMaster = ref<string | null>(null)

// Услуг много: по умолчанию показываем первые, остальные раскрываются кнопкой.
const SERVICES_COLLAPSED = 6
const servicesOpen = ref(false)
const serviceQuery = ref('')
const searching = computed(() => serviceQuery.value.trim() !== '')
const shownServices = computed(() => {
  if (searching.value) {
    const q = serviceQuery.value.trim().toLowerCase()
    return services.value.filter((s) => s.name.toLowerCase().includes(q))
  }
  return servicesOpen.value || serviceIndex.value >= SERVICES_COLLAPSED
    ? services.value
    : services.value.slice(0, SERVICES_COLLAPSED)
})
const canCollapse = computed(() => serviceIndex.value < SERVICES_COLLAPSED)

// Форма показывается только после загрузки каталога, поэтому услуга всегда есть.
const service = computed(
  () => services.value.find((s) => s.id === serviceId.value) ?? services.value[0],
)
const serviceIndex = computed(() => services.value.indexOf(service.value))
const pet = computed(() => PETS.find((p) => p.id === petId.value)!)
const master = computed(() => employees.value.find((e) => e.id === masterId.value))
// Мастера, которые работают с выбранным животным.
const suitable = computed(() =>
  employees.value.filter((e) => e.pets.includes(petId.value as PetId)),
)
const masterOptions = computed(() => [
  { value: 'any', label: 'Любой мастер' },
  ...suitable.value.map((e) => ({ value: e.id, label: e.name, hint: e.role })),
])
const masterText = computed(() => master.value?.name ?? bookedMaster.value ?? 'Любой мастер')
const dateText = computed(() => days[dayIndex.value].label)

// Неделя, в которой лежит выбранный день, всегда показана (мастер, заявка, «ближайшая дата»).
watch(dayIndex, (i) => (week.value = Math.floor(i / WEEK)))
const visibleDays = computed(() =>
  days
    .slice(week.value * WEEK, (week.value + 1) * WEEK)
    .map((d, k) => ({ ...d, index: week.value * WEEK + k })),
)
const weekLabel = computed(() => {
  const first = visibleDays.value[0]
  const last = visibleDays.value[visibleDays.value.length - 1]
  return first.month === last.month
    ? `${first.num} – ${last.num} ${MONTHS[last.month]}`
    : `${first.num} ${MONTHS[first.month]} – ${last.num} ${MONTHS[last.month]}`
})

function shiftWeek(delta: number) {
  week.value = Math.min(WEEKS_AHEAD - 1, Math.max(0, week.value + delta))
}

// Свайп по полоске дней переключает неделю.
let touchX: number | null = null
function onTouchStart(e: TouchEvent) {
  touchX = e.touches[0].clientX
}
function onTouchEnd(e: TouchEvent) {
  if (touchX === null) return
  const dx = e.changedTouches[0].clientX - touchX
  touchX = null
  if (Math.abs(dx) > 50) shiftWeek(dx < 0 ? 1 : -1)
}

// Мастер может принять запись, если работает все часы услуги и они не заняты чужими записями.
function masterSlot(e: Employee, dIdx: number, hour: number): 'ok' | 'busy' | 'off' {
  const day = days[dIdx]
  const hours = Array.from({ length: Math.ceil(service.value.mins / 60) }, (_, k) => hour + k)
  if (!hours.every((h) => worksAt(e, day.weekday, h))) return 'off'
  return hours.some((h) => isBusy(e.name, day.iso, h)) ? 'busy' : 'ok'
}

// Сегодня прошедшие часы недоступны. Для «любого мастера» слот свободен, если свободен хоть один.
function slotState(dIdx: number, i: number, mId: string) {
  const hour = FIRST_HOUR + i
  if (dIdx === 0 && hour <= now.getHours()) return { busy: true, off: false }
  const m = employees.value.find((e) => e.id === mId)
  const states = (m ? [m] : suitable.value).map((e) => masterSlot(e, dIdx, hour))
  const free = states.includes('ok')
  return { busy: !free && states.includes('busy'), off: !free && !states.includes('busy') }
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
// Если на показанной неделе нет свободных дней — предлагаем ближайший свободный день.
const nextFreeDay = computed(() => {
  const from = (week.value + 1) * WEEK
  if (visibleDays.value.some((d) => dayStates.value[d.index] === 'ok')) return null
  const i = dayStates.value.findIndex((st, k) => k >= from && st === 'ok')
  return i >= 0 ? { index: i, label: days[i].label } : null
})
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
  const m = employees.value.find((e) => e.id === id)
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

watch(bookingRequest, (r) => {
  if (!r) return
  if (r.serviceId && services.value.some((s) => s.id === r.serviceId)) serviceId.value = r.serviceId
  if (r.masterId) selectMaster(r.masterId)
})

// Другая услуга может занимать больше часов: выбранное время могло перестать подходить.
watch(serviceId, () => {
  const slot = slots.value.find((s) => s.time === time.value)
  if (!slot || slot.busy || slot.off) pickMaster()
})

function pickDay(i: number) {
  dayIndex.value = i
  week.value = Math.floor(i / WEEK)
  time.value = null
}

// Кнопка в сводке проверяет выбор времени и открывает окно с контактами.
function book() {
  if (!time.value) {
    error.value = 'Выберите свободное время визита.'
    return
  }
  error.value = ''
  contactError.value = ''
  confirmOpen.value = true
}

async function confirm() {
  if (!contact.name.trim()) {
    contactError.value = 'Укажите имя, чтобы администратор знал, как к вам обращаться.'
    return
  }
  if (contact.phone.replace(/\D/g, '').length < PHONE_DIGITS) {
    contactError.value = 'Введите телефон полностью, чтобы администратор мог подтвердить запись.'
    return
  }
  contactError.value = ''
  const hour = FIRST_HOUR + TIMES.indexOf(time.value!)
  const assigned =
    master.value ?? suitable.value.find((e) => masterSlot(e, dayIndex.value, hour) === 'ok')
  if (!assigned) return slotTaken()

  submitting.value = true
  const result = await submitBooking({
    service: service.value.name,
    master: assigned.name,
    pet: petId.value as PetId,
    date: days[dayIndex.value].iso,
    time: time.value!,
    name: contact.name.trim(),
    phone: contact.phone,
  })
  submitting.value = false

  if (result.ok) {
    bookedMaster.value = assigned.name
    confirmOpen.value = false
    done.value = true
  } else if (result.error === 'slot_taken') {
    slotTaken()
  } else {
    contactError.value = 'Не удалось отправить заявку. Попробуйте ещё раз или позвоните нам.'
  }
}

function slotTaken() {
  confirmOpen.value = false
  time.value = null
  error.value = 'Это время только что заняли. Выберите другое.'
}

function reset() {
  done.value = false
  bookedMaster.value = null
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

      <CatalogStatus
        v-if="catalogStatus !== 'ready'"
        :status="catalogStatus"
        @retry="loadCatalog"
      />
      <div v-else class="layout">
        <div class="card steps">
          <div class="step">
            <div class="step-head">
              <h3 class="step-title"><span class="num">1</span>Услуга</h3>
              <AppInput
                v-model="serviceQuery"
                icon="search"
                type="search"
                class="service-search"
                placeholder="Найти услугу"
                aria-label="Поиск услуги"
                autocomplete="off"
              />
            </div>
            <EmptyState
              v-if="searching && !shownServices.length"
              compact
              :query="serviceQuery"
              @reset="serviceQuery = ''"
            />
            <div v-else class="services">
              <button
                v-for="s in shownServices"
                :key="s.id"
                type="button"
                class="choice hov service"
                :aria-pressed="s.id === service.id"
                @click="serviceId = s.id"
              >
                <span class="service-name">{{ s.name }}</span>
                <span class="service-meta">
                  <span>{{ s.dur }}</span>
                  <span class="service-price">{{ formatPrice(s.price) }}</span>
                </span>
              </button>
            </div>
            <button
              v-if="canCollapse && !searching"
              type="button"
              class="next-free"
              :aria-expanded="servicesOpen"
              @click="servicesOpen = !servicesOpen"
            >
              {{ servicesOpen ? 'Свернуть' : `Показать все услуги (${services.length})` }}
            </button>
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
            <div class="step-head">
              <h3 class="step-title"><span class="num">4</span>День</h3>
              <div class="week-nav">
                <button
                  type="button"
                  class="week-btn prev hov"
                  aria-label="Предыдущая неделя"
                  :disabled="week === 0"
                  @click="shiftWeek(-1)"
                >
                  <AppIcon name="chevron-right" :size="20" />
                </button>
                <span class="week-label" aria-live="polite">{{ weekLabel }}</span>
                <button
                  type="button"
                  class="week-btn hov"
                  aria-label="Следующая неделя"
                  :disabled="week === WEEKS_AHEAD - 1"
                  @click="shiftWeek(1)"
                >
                  <AppIcon name="chevron-right" :size="20" />
                </button>
              </div>
            </div>
            <div
              class="row gap-8"
              @touchstart.passive="onTouchStart"
              @touchend.passive="onTouchEnd"
            >
              <AppTooltip
                v-for="d in visibleDays"
                :key="d.index"
                class="day-wrap"
                :text="DAY_TIPS[dayStates[d.index]]"
              >
                <button
                  type="button"
                  class="choice hov day"
                  :class="{ full: dayStates[d.index] === 'full' }"
                  :aria-pressed="dayStates[d.index] === 'ok' && d.index === dayIndex"
                  :aria-label="d.label"
                  :disabled="dayStates[d.index] !== 'ok'"
                  @click="pickDay(d.index)"
                >
                  <span class="day-wd">{{ d.wd }}</span>
                  <span class="day-num">{{ d.num }}</span>
                </button>
              </AppTooltip>
            </div>
            <button
              v-if="nextFreeDay"
              type="button"
              class="next-free"
              @click="pickDay(nextFreeDay.index)"
            >
              Ближайшая свободная дата — {{ nextFreeDay.label }} →
            </button>
          </div>

          <div class="step">
            <h3 class="step-title"><span class="num">5</span>Время</h3>
            <div class="row gap-8">
              <AppTooltip
                v-for="s in slots"
                :key="s.time"
                class="slot-wrap"
                :text="
                  s.off ? 'Мастер в это время не работает' : s.busy ? 'Время занято' : undefined
                "
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
              </AppTooltip>
            </div>
            <p class="hint">
              Зачёркнутое время или день уже заняты, серое с пунктиром — мастер в это время не
              работает.
            </p>
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
            <dl class="recap">
              <div>
                <dt>Услуга</dt>
                <dd>{{ service.name }}</dd>
              </div>
              <div>
                <dt>Мастер</dt>
                <dd>{{ masterText }}</dd>
              </div>
              <div>
                <dt>Когда</dt>
                <dd>{{ dateText }}, {{ time }}</dd>
              </div>
            </dl>
            <p class="thanks">
              Администратор позвонит по номеру <strong>{{ contact.phone }}</strong> и подтвердит
              запись.
            </p>
            <button type="button" class="again hov on-dark" @click="reset">Новая запись</button>
          </div>
        </aside>
      </div>
    </div>

    <AppModal v-model="confirmOpen" title="Подтверждение записи" :width="480">
      <form class="confirm" novalidate @submit.prevent="confirm">
        <h3 class="confirm-title">Как с вами связаться?</h3>
        <div class="confirm-recap">
          <span class="confirm-service">{{ service.name }}</span>
          <span class="confirm-when">
            <AppIcon name="clock" :size="16" />
            {{ dateText }}, {{ time }}
          </span>
          <span class="confirm-meta">
            <span>{{ pet.name }} · {{ masterText }} · {{ service.dur }}</span>
            <strong>{{ formatPrice(service.price) }}</strong>
          </span>
        </div>
        <div class="field">
          <label for="b-name">Имя</label>
          <AppInput
            id="b-name"
            v-model="contact.name"
            type="text"
            autocomplete="name"
            placeholder="Как к вам обращаться"
          />
        </div>
        <div class="field">
          <label for="b-phone">Телефон</label>
          <AppPhoneInput id="b-phone" v-model="contact.phone" />
        </div>
        <p v-if="contactError" role="alert" class="confirm-error">{{ contactError }}</p>
        <button type="submit" class="confirm-btn hov" :disabled="submitting">
          {{ submitting ? 'Отправляем…' : 'Подтвердить запись' }}
        </button>
        <p class="confirm-fine">Администратор перезвонит и подтвердит запись.</p>
      </form>
    </AppModal>
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

.step-head {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 10px 16px;
}

.service-search {
  flex: 0 1 260px;
  min-width: 0;
}

.week-nav {
  display: flex;
  align-items: center;
  gap: 8px;
}

.week-label {
  min-width: 150px;
  text-align: center;
  font-weight: 700;
  font-size: 15px;
}

.week-btn {
  width: 36px;
  height: 36px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  border: 2px solid var(--border);
  background: $white;
  color: var(--ink);
  cursor: pointer;

  &.prev :deep(svg) {
    transform: scaleX(-1);
  }

  &:disabled {
    border-color: #edf3f0;
    color: #9db1ad;
    cursor: default;
  }
}

.next-free {
  align-self: flex-start;
  padding: 0;
  border: 0;
  background: none;
  color: var(--ink);
  font: inherit;
  font-weight: 700;
  text-decoration: underline;
  text-underline-offset: 3px;
  cursor: pointer;
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

.services {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 10px;
}

.service {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  gap: 6px;
  min-width: 0;
  padding: 12px 16px;
  border-radius: 20px;
  text-align: left;
}

.service-name {
  font-weight: 800;
  font-size: 16px;
  line-height: 1.25;
}

.service-meta {
  width: 100%;
  display: flex;
  justify-content: space-between;
  gap: 8px;
  font-size: 14px;
  opacity: 0.85;
}

.service-price {
  font-weight: 700;
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

.slot-wrap {
  flex: 1 1 92px;
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

/* Окно с контактами */
.confirm {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 28px;
}

.confirm-title {
  margin: 0;
  padding-right: 40px;
  font-family: var(--font-head);
  font-weight: 700;
  font-size: 24px;
  line-height: 1.25;
}

.confirm-recap {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 14px 16px;
  border-radius: 20px;
  background: var(--mint);
}

.confirm-service {
  font-weight: 800;
  font-size: 17px;
}

.confirm-when {
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 700;
  color: var(--accent);
}

.confirm-meta {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 4px 12px;
  font-size: 14px;
  color: var(--muted);

  strong {
    color: var(--ink);
  }
}

.confirm-fine {
  margin: 0;
  text-align: center;
  font-size: 14px;
  color: var(--muted);
}

.confirm-error {
  margin: 0;
  font-size: 14px;
  color: #b3402a;
}

.confirm-btn {
  min-height: 56px;
  border: 0;
  border-radius: $radius-pill;
  background: var(--sun);
  color: var(--ink);
  font-weight: 800;
  font-size: 17px;
  cursor: pointer;

  &:disabled {
    opacity: 0.6;
    cursor: progress;
  }
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

.recap {
  padding: 16px;
  border-radius: 20px;
  background: rgb(255 255 255 / 8%);
}

.thanks {
  margin: 0;
  line-height: 1.6;
  color: #d8e8e4;

  strong {
    color: $white;
    white-space: nowrap;
  }
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
