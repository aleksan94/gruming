export type IconName =
  | 'heart'
  | 'drop'
  | 'clock'
  | 'video'
  | 'scissors'
  | 'waves'
  | 'comb'
  | 'sparkle'
  | 'pin'
  | 'phone'
  | 'mail'
  | 'check'
  | 'play'
  | 'pause'
  | 'paw'
  | 'arrow-up'
export type Tint = 'peach' | 'sky' | 'butter' | 'mint' | 'green'

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
  dur: string
  who: string
  text: string
}
export interface ScheduleSlot {
  days: string
  hours: string
}
export interface Employee {
  id: string
  name: string
  role: string
  tint: Tint
  /** Путь к фото (например, /team/anna.jpg из public). Без фото показывается заглушка. */
  photo?: string
  experience: string
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

export const SERVICES: Service[] = [
  {
    id: 'bath',
    icon: 'drop',
    tint: 'sky',
    name: 'Купание и сушка',
    price: 1800,
    dur: '1,5 ч',
    who: 'собаки и кошки',
    text: 'Шампунь по типу шерсти, питательная маска, сушка феном и вычёсывание.',
  },
  {
    id: 'hygiene',
    icon: 'scissors',
    tint: 'peach',
    name: 'Гигиеническая стрижка',
    price: 1500,
    dur: '1 ч',
    who: 'собаки и кошки',
    text: 'Аккуратно убираем шерсть на лапах, животе и вокруг глаз и ушей.',
  },
  {
    id: 'full',
    icon: 'waves',
    tint: 'butter',
    name: 'Стрижка по породе',
    price: 3200,
    dur: '3 ч',
    who: 'собаки и кошки',
    text: 'Полный образ: купание, стрижка по стандарту породы и аккуратная укладка.',
  },
  {
    id: 'trim',
    icon: 'comb',
    tint: 'green',
    name: 'Тримминг',
    price: 3000,
    dur: '2,5 ч',
    who: 'собаки',
    text: 'Ручное удаление отмершей шерсти для жёсткошёрстных пород и вычёсывание подшёрстка.',
  },
  {
    id: 'nails',
    icon: 'paw',
    tint: 'peach',
    name: 'Когти и уши',
    price: 600,
    dur: '30 мин',
    who: 'собаки и кошки',
    text: 'Подстригаем когти, чистим уши и убираем лишнюю шерсть между подушечками.',
  },
  {
    id: 'spa',
    icon: 'sparkle',
    tint: 'sky',
    name: 'SPA-уход',
    price: 2200,
    dur: '1,5 ч',
    who: 'собаки и кошки',
    text: 'Питательная маска, расслабляющий массаж и ароматерапия для спокойной шёрстки.',
  },
]

export const EMPLOYEES: Employee[] = [
  {
    id: 'anna',
    name: 'Иванова Анна Сергеевна',
    role: 'Старший грумер',
    tint: 'peach',
    experience: 'Опыт 8 лет. Работает со всеми породами, специализируется на стрижках по стандарту.',
    schedule: [{ days: 'Пн–Пт', hours: '10:00–18:00' }],
  },
  {
    id: 'maria',
    name: 'Петрова Мария Олеговна',
    role: 'Грумер-кошатница',
    tint: 'sky',
    experience: 'Опыт 5 лет. Мягко работает с кошками и тревожными питомцами, делает SPA-уход.',
    schedule: [
      { days: 'Пн–Вт', hours: '10:00–14:00' },
      { days: 'Чт–Пт', hours: '15:00–20:00' },
    ],
  },
  {
    id: 'dmitry',
    name: 'Соколов Дмитрий Андреевич',
    role: 'Грумер-триммингист',
    tint: 'butter',
    experience: 'Опыт 6 лет. Тримминг жёсткошёрстных пород, подготовка к выставкам.',
    schedule: [{ days: 'Ср–Вс', hours: '10:00–18:00' }],
  },
]

export const PETS: Pet[] = [
  { id: 'dog', name: 'Собака' },
  { id: 'cat', name: 'Кошка' },
]

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

const WEEK = ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс']

/** Сотрудник работает в этот день недели (0 = вс … 6 = сб, как в Date.getDay) в этот час (слот длится час). */
export function worksAt(e: Employee, weekday: number, hour: number): boolean {
  const wd = (weekday + 6) % 7
  return e.schedule.some((s) => {
    const [from, to = from] = s.days.toLowerCase().split('–')
    const a = WEEK.indexOf(from)
    const b = WEEK.indexOf(to)
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
