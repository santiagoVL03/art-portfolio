export function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString('es', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
