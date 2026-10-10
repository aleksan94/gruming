import {
  ICONS,
  TINTS,
  WEEK_DAYS,
  type Employee,
  type IconName,
  type PetId,
  type ScheduleSlot,
  type Service,
} from './salon'

/** Строка листа: заголовок колонки -> значение ячейки. */
export type SheetRow = Record<string, string | undefined>

/** Занятый слот мастера: `hours` — сколько подряд идущих часов он занимает. */
export interface BusyRecord {
  master: string
  date: string
  hour: number
  hours: number
}

/** Ответ Apps Script на GET (см. google-sheets/Code.gs). */
export interface SheetPayload {
  masters: SheetRow[]
  services: SheetRow[]
  busy: BusyRecord[]
}

// Если иконка или цвет в листе не заданы, подбираем по кругу, чтобы карточки не были одинаковыми.
const FALLBACK_ICONS: IconName[] = ['drop', 'scissors', 'waves', 'comb', 'paw', 'sparkle', 'heart']

const text = (v?: string): string => (v ?? '').trim()

/** Ячейка с несколькими пунктами: по одному в строке (Alt+Enter в Google Sheets). */
const lines = (v?: string): string[] =>
  text(v)
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter(Boolean)

function pick<T extends string>(v: string | undefined, allowed: readonly T[], fallback: T): T {
  const value = text(v).toLowerCase()
  return allowed.find((a) => a === value) ?? fallback
}

/** «собаки», «кошки», «собаки и кошки»; пусто или непонятно — оба вида. */
function parsePets(v?: string): PetId[] {
  const s = text(v).toLowerCase()
  const pets: PetId[] = []
  if (/собак|щен/.test(s)) pets.push('dog')
  if (/кош|кот/.test(s)) pets.push('cat')
  return pets.length ? pets : ['dog', 'cat']
}

const SCHEDULE_LINE =
  /^([а-яё]{2})(?:\s*[–—-]\s*([а-яё]{2}))?\s*:?\s*(\d{1,2})(?::(\d{2}))?\s*[–—-]\s*(\d{1,2})(?::(\d{2}))?$/i

/** «Пн–Пт 10:00–18:00» (по интервалу в строке) -> [{ days: 'Пн–Пт', hours: '10:00–18:00' }]. */
export function parseSchedule(v?: string): ScheduleSlot[] {
  return lines(v).flatMap((line) => {
    const m = SCHEDULE_LINE.exec(line)
    if (!m) return []
    const [, from, to, h1, m1 = '00', h2, m2 = '00'] = m
    const days = [from, to].filter((d): d is string => !!d).map((d) => d.toLowerCase())
    if (days.some((d) => !WEEK_DAYS.includes(d))) return []
    const cap = (d: string) => d[0].toUpperCase() + d.slice(1)
    const time = (h: string, min: string) => `${h.padStart(2, '0')}:${min}`
    return [{ days: days.map(cap).join('–'), hours: `${time(h1, m1)}–${time(h2, m2)}` }]
  })
}

/** 90 -> «1,5 ч», 30 -> «30 мин». */
export function formatDuration(mins: number): string {
  if (mins < 60) return `${mins} мин`
  return `${String(Math.round((mins / 60) * 100) / 100).replace('.', ',')} ч`
}

const toNumber = (v?: string): number =>
  Number(
    text(v)
      .replace(/[^\d.,]/g, '')
      .replace(',', '.'),
  )

export function parseServices(rows: SheetRow[]): Service[] {
  return rows
    .filter((r) => text(r['Название']))
    .map((r, i) => {
      const mins = toNumber(r['Длительность (мин)']) || 60
      return {
        id: text(r['Название']),
        icon: pick(r['Иконка'], ICONS, FALLBACK_ICONS[i % FALLBACK_ICONS.length]),
        tint: pick(r['Цвет'], TINTS, TINTS[i % TINTS.length]),
        name: text(r['Название']),
        price: toNumber(r['Стоимость']),
        dur: formatDuration(mins),
        mins,
        who: text(r['Для кого']),
        text: text(r['Описание']),
        more: text(r['Подробное описание']),
        includes: lines(r['Что входит']),
        note: text(r['Важно']),
      }
    })
}

export function parseMasters(rows: SheetRow[]): Employee[] {
  return rows
    .filter((r) => text(r['ФИО']))
    .map((r, i) => ({
      id: text(r['ФИО']),
      name: text(r['ФИО']),
      role: text(r['Должность']),
      tint: pick(r['Цвет'], TINTS, TINTS[i % TINTS.length]),
      photo: text(r['Фото']) || undefined,
      experience: text(r['Описание']),
      about: text(r['Подробное описание']),
      specialties: lines(r['Специализация']),
      pets: parsePets(r['С кем работает']),
      schedule: parseSchedule(r['График работы']),
    }))
}

/** Ключ занятого часа мастера. */
export const busyKey = (master: string, date: string, hour: number): string =>
  `${master}|${date}|${hour}`

/** Раскладывает занятые слоты на отдельные часы для быстрой проверки. */
export function busyKeys(records: BusyRecord[]): Set<string> {
  const keys = new Set<string>()
  for (const b of records) {
    for (let k = 0; k < b.hours; k++) keys.add(busyKey(b.master, b.date, b.hour + k))
  }
  return keys
}
