export function toPtBrDate(isoDate: string): string {
  if (!isoDate) return '-'

  const date = new Date(`${isoDate}T00:00:00`)
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

export function isPastDate(isoDate: string): boolean {
  const currentDate = new Date()
  const comparisonDate = new Date(`${isoDate}T23:59:59`)
  return comparisonDate < currentDate
}
