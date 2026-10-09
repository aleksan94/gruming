/** Форматирует ввод в маску +7 (999) 999-99-99. Пустая строка, если цифр нет. */
export function formatPhone(raw: string): string {
  let digits = raw.replace(/\D/g, '')
  if (digits[0] === '7' || digits[0] === '8') digits = digits.slice(1)
  digits = digits.slice(0, 10)
  if (!digits) return ''

  let out = '+7 (' + digits.slice(0, 3)
  if (digits.length > 3) out += ') ' + digits.slice(3, 6)
  if (digits.length > 6) out += '-' + digits.slice(6, 8)
  if (digits.length > 8) out += '-' + digits.slice(8, 10)
  return out
}
