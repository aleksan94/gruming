import { ref } from 'vue'

/** Запрос из других секций: выбрать мастера и/или услугу в онлайн-записи. `seq` меняется при каждом клике, чтобы watch срабатывал повторно. */
export const bookingRequest = ref<{ masterId?: string; serviceId?: string; seq: number } | null>(
  null,
)

export function requestBooking(masterId?: string, serviceId?: string) {
  bookingRequest.value = { masterId, serviceId, seq: (bookingRequest.value?.seq ?? 0) + 1 }
  document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' })
}
