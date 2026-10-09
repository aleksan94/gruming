// Поиск без учёта регистра: пустой запрос подходит всему.
export function textMatch(query: string, ...fields: string[]) {
  const q = query.trim().toLowerCase()
  return !q || fields.some((f) => f.toLowerCase().includes(q))
}
