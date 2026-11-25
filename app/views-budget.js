// Budget view: the monthly plan, category by category. Planned amounts are
// editable in place — changing one updates the dashboard, the charts and the
// "every dollar has a job" check straight away.

import { money, percent } from './format.js';
import { plannedVsActualBars } from './charts.js';
import { state, totalPlanned, totalActual } from './store.js';

const INCOME_TOTAL = 4850;

export function budgetView() {
  const planned = totalPlanned();
  const actual = totalActual();
  const unassigned = INCOME_TOTAL - planned;
  const rows = state.categories.map((c) => {
    const remaining = c.planned - c.actual;
    const used = Math.min(100, Math.round((c.actual / c.planned) * 100));
    const status = c.actual > c.planned
      ? `<span class="chip red">Over by ${money(c.actual - c.planned)}</span>`
      : used >= 90
        ? `<span class="chip amber">Almost spent</span>`
        : `<span class="chip">On track</span>`;
    return `<tr>
      <td><span class="dot" style="background:${c.color}"></span>${c.name}</td>
      <td class="num"><label class="visually-hidden" for="plan-${c.id}">Planned amount for ${c.name}</label><input id="plan-${c.id}" type="number" min="0" step="5" value="${c.planned}" data-plan="${c.id}" style="width:92px;text-align:right" aria-label="Planned amount for ${c.name}"></td>
      <td class="num money">${money(c.actual)}</td>
      <td class="num money ${remaining < 0 ? 'neg' : 'pos'}">${remaining < 0 ? '−' : ''}${money(Math.abs(remaining))}</td>
      <td style="min-width:130px"><div class="bar ${c.actual > c.planned ? 'over' : used >= 90 ? 'warn' : ''}"><span style="width:${used}%"></span></div><div class="bar-note"><span>${used}% used</span></div></td>
      <td>${status}</td>
    </tr>`;
  }).join('');

  const chartRows = state.categories.map((c) => ({
    label: c.name.replace(' (rent)', ''),
    planned: c.planned,
    actual: c.actual,
    over: c.actual > c.planned,
  }));

  return `
  <div class="page-head">
    <h1>The November budget</h1>
    <p>Every dollar of the ${money(INCOME_TOTAL)} coming in has a job. Edit any planned amount — the totals below, the chart and the dashboard update immediately, and your changes are saved in this browser.</p>
  </div>

  <div class="card">
    <div class="stat-row">
      <div class="stat"><div class="label">Money in</div><div class="value pos">${money(INCOME_TOTAL)}</div></div>
      <div class="stat"><div class="label">Planned out</div><div class="value">${money(planned)}</div></div>
      <div class="stat"><div class="label">Actually spent</div><div class="value">${money(actual)}</div></div>
      <div class="stat"><div class="label">Unassigned</div><div class="value ${unassigned === 0 ? 'pos' : 'neg'}">${money(unassigned)}</div><div class="hint">${unassigned === 0 ? 'every dollar has a job ✓' : unassigned > 0 ? 'give this money a job' : 'planned more than the pay — trim a category'}</div></div>
    </div>
  </div>

  <section class="card">
    <h2>Planned vs actual, by category</h2>
    <div class="table-wrap">
      <table>
        <thead><tr><th>Category</th><th class="num">Planned</th><th class="num">Actual</th><th class="num">Left</th><th>Used</th><th>Status</th></tr></thead>
        <tbody>${rows}</tbody>
        <tfoot><tr><td><strong>Total</strong></td><td class="num"><strong class="money">${money(planned)}</strong></td><td class="num"><strong class="money">${money(actual)}</strong></td><td class="num"><strong class="money ${INCOME_TOTAL - actual >= 0 ? 'pos' : 'neg'}">${money(INCOME_TOTAL - actual)}</strong></td><td colspan="2"><span class="hint">${percent(actual, planned)} of the plan spent</span></td></tr></tfoot>
      </table>
    </div>
    <p class="hint">Tip: when a category goes over, move money from one that is under — do not just raise the plan. Dining out is $34 over this month; Fun money is $14 under.</p>
  </section>

  <section class="card">
    <h2>Planned vs actual, as a chart</h2>
    ${plannedVsActualBars(chartRows)}
  </section>

  <div class="callout">
    <strong>How the Ellises built this plan:</strong> fixed costs first (rent, bills, debt), then savings, then the flexible categories. Groceries get $620 because that is what four people actually eat in a month here — the plan is built from real spending, not from a wish.
  </div>`;
}
