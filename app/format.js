// Formatting helpers: every dollar amount and date on the site goes through
// these, so "$1,450.00" always looks the same wherever it appears.

export function money(amount, withCents = false) {
  const value = Number(amount) || 0;
  const options = {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: withCents ? 2 : 0,
    maximumFractionDigits: withCents ? 2 : 0,
  };
  return new Intl.NumberFormat('en-US', options).format(value);
}

export function signedMoney(amount, withCents = false) {
  const value = Number(amount) || 0;
  if (value > 0) return `+${money(value, withCents)}`;
  if (value < 0) return `−${money(Math.abs(value), withCents)}`;
  return money(0, withCents);
}

export function percent(part, whole) {
  if (!whole) return '0%';
  return `${Math.round((part / whole) * 100)}%`;
}

export function prettyDate(iso) {
  const [year, month, day] = iso.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function escapeHtml(text) {
  return String(text)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}
