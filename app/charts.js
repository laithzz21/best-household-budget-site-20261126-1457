// Charts, drawn as plain inline SVG — no library, no images, no network.
// Both builders take plain data and return an SVG string the views drop into
// the page.

import { money } from './format.js';

// Donut: one slice per category, sized by what the household actually spent.
// The centre shows the total. Slices are drawn as arcs around a circle.
export function donutChart(slices, size = 190) {
  const total = slices.reduce((sum, s) => sum + s.value, 0);
  const radius = 80;
  const cx = size / 2;
  const cy = size / 2;
  let angle = -Math.PI / 2;
  const paths = slices.map((slice) => {
    const fraction = total ? slice.value / total : 0;
    const sweep = fraction * Math.PI * 2;
    const startX = cx + radius * Math.cos(angle);
    const startY = cy + radius * Math.sin(angle);
    angle += sweep;
    const endX = cx + radius * Math.cos(angle);
    const endY = cy + radius * Math.sin(angle);
    const large = sweep > Math.PI ? 1 : 0;
    const d = `M ${cx} ${cy} L ${startX.toFixed(1)} ${startY.toFixed(1)} A ${radius} ${radius} 0 ${large} 1 ${endX.toFixed(1)} ${endY.toFixed(1)} Z`;
    return `<path d="${d}" fill="${slice.color}" stroke="#faf6ee" stroke-width="1.5"><title>${slice.label}: ${money(slice.value)}</title></path>`;
  });
  const hole = `<circle cx="${cx}" cy="${cy}" r="46" fill="#ffffff"/>`;
  const centre = `<text x="${cx}" y="${cy - 2}" text-anchor="middle" font-size="15" font-weight="bold" fill="#1e2b23">${money(total)}</text>`
    + `<text x="${cx}" y="${cy + 15}" text-anchor="middle" font-size="10" fill="#5d6b60">budgeted in Nov</text>`;
  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" role="img" aria-label="Donut chart of November spending by category">${paths.join('')}${hole}${centre}</svg>`;
}

// Grouped bars: planned vs actual for each category, as horizontal bars.
export function plannedVsActualBars(rows, width = 640) {
  const max = Math.max(...rows.map((r) => Math.max(r.planned, r.actual)), 1);
  const barHeight = 9;
  const rowHeight = 34;
  const labelWidth = 150;
  const height = rows.length * rowHeight + 8;
  const scale = (value) => (value / max) * (width - labelWidth - 90);
  const body = rows.map((row, i) => {
    const y = 8 + i * rowHeight;
    return `<text x="0" y="${y + 12}" font-size="12" fill="#1e2b23">${row.label}</text>`
      + `<rect x="${labelWidth}" y="${y}" width="${Math.max(scale(row.planned), 2).toFixed(1)}" height="${barHeight}" rx="4" fill="#c9d8cb"><title>Planned ${money(row.planned)}</title></rect>`
      + `<rect x="${labelWidth}" y="${y + 12}" width="${Math.max(scale(row.actual), 2).toFixed(1)}" height="${barHeight}" rx="4" fill="${row.over ? '#a63a2a' : '#1d5c43'}"><title>Actual ${money(row.actual)}</title></rect>`
      + `<text x="${width - 82}" y="${y + 12}" font-size="11" fill="#5d6b60" text-anchor="end">${money(row.actual)} / ${money(row.planned)}</text>`;
  }).join('');
  const legend = `<text x="${labelWidth}" y="${height - 2}" font-size="11" fill="#5d6b60">light bar = planned, dark bar = actual (red = over budget)</text>`;
  return `<svg width="100%" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="Planned versus actual spending per category">${body}${legend}</svg>`;
}

// Six-month trend: income as a light bar, spending as a dark bar, per month.
export function monthlyTrendBars(months, width = 640) {
  const max = Math.max(...months.map((m) => Math.max(m.income, m.spent)), 1);
  const height = 210;
  const baseline = 180;
  const slot = width / months.length;
  const barWidth = 26;
  const scale = (value) => (value / max) * 150;
  const body = months.map((m, i) => {
    const x = i * slot + slot / 2;
    const incomeH = scale(m.income);
    const spentH = scale(m.spent);
    return `<rect x="${(x - barWidth - 3).toFixed(1)}" y="${(baseline - incomeH).toFixed(1)}" width="${barWidth}" height="${incomeH.toFixed(1)}" rx="3" fill="#c9d8cb"><title>${m.month}: income ${money(m.income)}</title></rect>`
      + `<rect x="${(x + 3).toFixed(1)}" y="${(baseline - spentH).toFixed(1)}" width="${barWidth}" height="${spentH.toFixed(1)}" rx="3" fill="#1d5c43"><title>${m.month}: spent ${money(m.spent)}</title></rect>`
      + `<text x="${x.toFixed(1)}" y="${baseline + 18}" font-size="12" text-anchor="middle" fill="#1e2b23">${m.month}</text>`
      + `<text x="${x.toFixed(1)}" y="${(baseline - spentH - 6).toFixed(1)}" font-size="11" text-anchor="middle" fill="#5d6b60">${money(m.spent)}</text>`;
  }).join('');
  const legend = `<text x="0" y="14" font-size="11" fill="#5d6b60">light = money in, dark = money out</text>`;
  return `<svg width="100%" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="Income and spending for the last six months">${legend}${body}</svg>`;
}
