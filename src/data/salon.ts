export const ICONS = [
  'search',
  'heart',
  'drop',
  'clock',
  'video',
  'scissors',
  'waves',
  'comb',
  'sparkle',
  'pin',
  'phone',
  'mail',
  'check',
  'play',
  'pause',
  'paw',
  'arrow-up',
  'chevron-right',
] as const
export type IconName = (typeof ICONS)[number]
export const TINTS = ['peach', 'sky', 'butter', 'mint', 'green'] as const
export type Tint = (typeof TINTS)[number]

export interface NavItem {
  href: string
  label: string
}
export interface Advantage {
  icon: IconName
  tint: Tint
  title: string
  text: string
}
export interface Service {
  id: string
  icon: IconName
  tint: Tint
  name: string
  price: number
  /** Подпись длительности для интерфейса («1,5 ч»). */
  dur: string
  /** Длительность в минутах: по ней считается, сколько слотов занимает запись. */
  mins: number
  who: string
  text: string
  /** Развёрнутое описание для модального окна. */
  more: string
  /** Что входит в услугу. */
  includes: string[]
  /** Важное перед визитом. */
  note: string
}
export interface ScheduleSlot {
  days: string
  hours: string
}
export type PetId = 'dog' | 'cat'
export interface Employee {
  id: string
  name: string
  role: string
  tint: Tint
  /** Путь к фото (например, /team/anna.jpg из public). Без фото показывается заглушка. */
  photo?: string
  experience: string
  /** Развёрнутый рассказ о мастере для модального окна. */
  about: string
  /** Чем мастер занимается лучше всего. */
  specialties: string[]
  /** С какими животными работает мастер: собаки, кошки или и те и другие. */
  pets: PetId[]
  /** Один или несколько интервалов работы (например, пн–вт и чт–пт в разное время). */
  schedule: ScheduleSlot[]
}
export interface Pet {
  id: string
  name: string
}
export interface Cam {
  id: string
  name: string
  title: string
  desc: string
}
export interface Contact {
  icon: IconName
  tint: Tint
  label: string
  value: string
  wrap?: boolean
}

export const NAV: NavItem[] = [
  { href: '#about', label: 'О салоне' },
  { href: '#services', label: 'Услуги' },
  { href: '#team', label: 'Мастера' },
  { href: '#booking', label: 'Запись' },
  { href: '#live', label: 'Трансляция' },
  { href: '#contacts', label: 'Контакты' },
]

export const ADVANTAGES: Advantage[] = [
  {
    icon: 'heart',
    tint: 'peach',
    title: 'Один мастер, один питомец',
    text: 'Без очередей в клетках и без спешки между клиентами.',
  },
  {
    icon: 'drop',
    tint: 'sky',
    title: 'Мягкая косметика',
    text: 'Шампуни и маски подбираем по типу шерсти и состоянию кожи.',
  },
  {
    icon: 'clock',
    tint: 'butter',
    title: 'Перерывы по запросу',
    text: 'Отдых, вода и поглаживания, если питомец устал.',
  },
  {
    icon: 'video',
    tint: 'mint',
    title: 'Эфир и фото',
    text: 'Смотрите процесс онлайн и получайте фото после груминга.',
  },
]

export const PETS: Pet[] = [
  { id: 'dog', name: 'Собака' },
  { id: 'cat', name: 'Кошка' },
]

const PET_LABELS: Record<PetId, string> = { dog: 'Собаки', cat: 'Кошки' }

/** Подпись для мастера: «Собаки», «Кошки» или «Собаки и кошки». */
export function petsLabel(pets: PetId[]): string {
  const names = (['dog', 'cat'] as PetId[])
    .filter((p) => pets.includes(p))
    .map((p) => PET_LABELS[p])
  return names.join(' и ').replace(/ и К/, ' и к')
}

export const TIMES = [
  '10:00',
  '11:00',
  '12:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
  '18:00',
  '19:00',
]
export const FIRST_HOUR = 10

export const WEEK_DAYS = ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс']

/** Сотрудник работает в этот день недели (0 = вс … 6 = сб, как в Date.getDay) в этот час (слот длится час). */
export function worksAt(e: Employee, weekday: number, hour: number): boolean {
  const wd = (weekday + 6) % 7
  return e.schedule.some((s) => {
    const [from, to = from] = s.days.toLowerCase().split('–')
    const a = WEEK_DAYS.indexOf(from)
    const b = WEEK_DAYS.indexOf(to)
    const [start, end] = s.hours.split('–').map((h) => parseInt(h, 10))
    const inDays = a <= b ? wd >= a && wd <= b : wd >= a || wd <= b
    return inDays && hour >= start && hour + 1 <= end
  })
}

export const CAMS: Cam[] = [
  { id: 'bath', name: 'Ванная', title: 'Камера 1 · Ванная', desc: 'Купание и сушка' },
  {
    id: 'table',
    name: 'Стол для стрижки',
    title: 'Камера 2 · Стол для стрижки',
    desc: 'Стрижка и тримминг',
  },
  {
    id: 'rest',
    name: 'Зона отдыха',
    title: 'Камера 3 · Зона отдыха',
    desc: 'Отдых между процедурами',
  },
]

export const TOPICS = [
  'Вопрос об услугах',
  'Изменить или отменить запись',
  'Особенности питомца',
  'Отзыв или пожелание',
]

export const CONTACTS: Contact[] = [
  { icon: 'pin', tint: 'peach', label: 'Адрес', value: '[Город], ул. [Название улицы], [дом]' },
  { icon: 'phone', tint: 'sky', label: 'Телефон', value: '+7 (000) 000-00-00' },
  { icon: 'clock', tint: 'butter', label: 'Часы работы', value: 'Ежедневно, 10:00–20:00' },
  { icon: 'mail', tint: 'mint', label: 'Почта', value: 'hello@[ваш-домен].ru', wrap: true },
]

export const formatPrice = (n: number): string =>
  'от ' + String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' ₽'
