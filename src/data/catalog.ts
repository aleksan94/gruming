import { ref, shallowRef } from 'vue'
import { DEMO_EMPLOYEES, DEMO_SERVICES } from './demo'
import type { Employee, PetId, Service } from './salon'
import {
  busyKey,
  busyKeys,
  parseMasters,
  parseServices,
  type BusyRecord,
  type SheetPayload,
} from './sheets'

/** Адрес Google Apps Script Web App. Не задан — работаем на демо-данных без сети. */
const API_URL = import.meta.env.VITE_API_URL
const CACHE_KEY = 'catalog:v1'

export type CatalogStatus = 'loading' | 'ready' | 'error'

export const services = ref<Service[]>([])
export const employees = ref<Employee[]>([])
export const catalogStatus = ref<CatalogStatus>('loading')

const busy = shallowRef(new Set<string>())

/** Час мастера уже занят чужой записью. */
export const isBusy = (master: string, date: string, hour: number): boolean =>
  busy.value.has(busyKey(master, date, hour))

function addBusy(record: BusyRecord) {
  busy.value = new Set([...busy.value, ...busyKeys([record])])
}

function apply(payload: SheetPayload): boolean {
  const s = parseServices(payload.services ?? [])
  const e = parseMasters(payload.masters ?? [])
  if (!s.length || !e.length) return false
  services.value = s
  employees.value = e
  busy.value = busyKeys(payload.busy ?? [])
  catalogStatus.value = 'ready'
  return true
}

function readCache(): SheetPayload | null {
  try {
    return JSON.parse(localStorage.getItem(CACHE_KEY) ?? 'null')
  } catch {
    return null
  }
}

function writeCache(payload: SheetPayload) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(payload))
  } catch {
    // приватный режим или переполнение: кэш — лишь ускорение
  }
}

/** Грузит каталог и занятые слоты. Прошлый ответ из кэша показываем сразу, свежий подменяет его. */
export async function loadCatalog(): Promise<void> {
  if (!API_URL) {
    services.value = DEMO_SERVICES
    employees.value = DEMO_EMPLOYEES
    catalogStatus.value = 'ready'
    return
  }
  const cached = readCache()
  const hasCache = !!cached && apply(cached)
  if (!hasCache) catalogStatus.value = 'loading'
  try {
    const res = await fetch(API_URL)
    if (!res.ok) throw new Error(String(res.status))
    const payload: SheetPayload = await res.json()
    if (!apply(payload)) throw new Error('empty')
    writeCache(payload)
  } catch {
    if (!hasCache) catalogStatus.value = 'error'
  }
}

export interface BookingRequest {
  service: string
  master: string
  pet: PetId
  /** YYYY-MM-DD */
  date: string
  /** HH:00 */
  time: string
  name: string
  phone: string
}

export type BookingResult = { ok: true } | { ok: false; error: 'slot_taken' | 'failed' }

export async function submitBooking(req: BookingRequest): Promise<BookingResult> {
  const service = services.value.find((s) => s.name === req.service)
  const hours = Math.ceil((service?.mins ?? 60) / 60)
  const record = { master: req.master, date: req.date, hour: parseInt(req.time, 10), hours }

  if (!API_URL) {
    await new Promise((resolve) => setTimeout(resolve, 600))
    addBusy(record)
    return { ok: true }
  }
  try {
    // text/plain — «простой» запрос без preflight, который Apps Script не умеет обрабатывать
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(req),
    })
    const data: { ok: boolean; error?: string } = await res.json()
    if (data.ok) {
      addBusy(record)
      return { ok: true }
    }
    if (data.error === 'slot_taken') {
      void loadCatalog()
      return { ok: false, error: 'slot_taken' }
    }
  } catch {
    // сеть недоступна или ответ не JSON
  }
  return { ok: false, error: 'failed' }
}
