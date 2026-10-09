import { ref } from 'vue'

/** Запрос из других секций: выбрать мастера в онлайн-записи. `seq` меняется при каждом клике, чтобы watch срабатывал повторно. */
export const bookingRequest = ref<{ masterId: string; seq: number } | null>(null)

export function requestBooking(masterId: string) {
  bookingRequest.value = { masterId, seq: (bookingRequest.value?.seq ?? 0) + 1 }
  document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' })
}
