// Dashboard view: the month at a glance — income, spending, what is left,
// where the money went, the six-month trend, bills due and the latest spending.

import { HOUSEHOLD, MONTHS, BILLS } from './data.js';
import { money, percent } from './format.js';
import { donutChart, monthlyTrendBars } from './charts.js';
import { state, totalActual, categoryName } from './store.js';

const INCOME_TOTAL = 4850;

export function dashboardView() {
  const spent = totalActual();
  const left = INCOME_TOTAL - spent;
  const savings = state.categories.find((c) => c.id === 'savings');
  const savingsRate = percent(savings ? savings.actual : 0, INCOME_TOTAL);
  const over = state.categories.filter((c) => c.actual > c.planned);
  const slices = state.categories.map((c) => ({ label: c.name, value: c.actual, color: c.color }));
  const recent = state.transactions.slice(0, 5);
  const topGoals = [...state.goals].sort((a, b) => b.saved / b.target - a.saved / a.target).slice(0, 2);

  const overNote = over.length
    ? `<div class="callout amber"><strong>Heads up:</strong> ${over.map((c) => `${c.name} is ${money(c.actual - c.planned)} over its ${money(c.planned)} plan`).join('; ')}. Move money from another category on the <a href="#/budget">Budget</a> page instead of pretending it did not happen.</div>`
    : `<div class="callout"><strong>On track:</strong> every category is inside its plan so far this month.</div>`;

  return `
  <div class="page-head">
    <h1>${HOUSEHOLD.month} — ${HOUSEHOLD.name}</h1>
    <p>${HOUSEHOLD.members}. Take-home pay is ${money(INCOME_TOTAL)} a month, and every dollar of it has a job. Here is where November stands, with ${left >= 0 ? money(left) + ' still unspent' : money(Math.abs(left)) + ' over plan'}.</p>
  </div>

  <div class="card">
    <div class="stat-row">
      <div class="stat"><div class="label">Money in</div><div class="value pos">${money(INCOME_TOTAL)}</div><div class="hint">take-home pay, November</div></div>
      <div class="stat"><div class="label">Money out</div><div class="value">${money(spent)}</div><div class="hint">planned spending + savings</div></div>
      <div class="stat"><div class="label">Left to spend</div><div class="value ${left >= 0 ? 'pos' : 'neg'}">${money(left)}</div><div class="hint">unspent from November's pay</div></div>
      <div class="stat"><div class="label">Savings rate</div><div class="value">${savingsRate}</div><div class="hint">${money(savings ? savings.actual : 0)} saved this month</div></div>
    </div>
    ${overNote}
  </div>

  <div class="grid grid-2-1">
    <section class="card">
      <h2>Where November's money went</h2>
      <div class="donut-wrap">
        ${donutChart(slices)}
        <ul class="legend">
          ${[...state.categories].sort((a, b) => b.actual - a.actual).slice(0, 8).map((c) => `
            <li><span class="left"><span class="dot" style="background:${c.color}"></span>${c.name}</span><strong class="money">${money(c.actual)}</strong></li>`).join('')}
          <li><span class="left"><span class="dot" style="background:#d8d0bd"></span>Everything else</span><strong class="money">${money(state.categories.slice().sort((a, b) => b.actual - a.actual).slice(8).reduce((s, c) => s + c.actual, 0))}</strong></li>
        </ul>
      </div>
      <p class="hint">Savings and the debt payment are counted too: they are money going out with a purpose. See the full breakdown on the <a href="#/budget">Budget</a> page.</p>
    </section>

    <section class="card">
      <h2>Bills coming up</h2>
      <ul class="clean-list">
        ${BILLS.map((b) => `<li><span>${b.name}<br><span class="sub">due ${b.due}${b.autopay ? ' · autopay on' : ' · pay by hand'}</span></span><strong class="money">${money(b.amount, true)}</strong></li>`).join('')}
      </ul>
      <p class="hint">Total due before 18 December: <strong class="money">${money(BILLS.reduce((s, b) => s + b.amount, 0), true)}</strong>.</p>
    </section>
  </div>

  <div class="grid grid-2">
    <section class="card">
      <h2>Six months: money in vs money out</h2>
      ${monthlyTrendBars(MONTHS)}
      <p class="hint">November is the fifth month in a row the family spent less than it earned. August was the tight one — a $4,780 month against $4,850 coming in.</p>
    </section>

    <section class="card">
      <h2>Latest spending</h2>
      <ul class="clean-list">
        ${recent.map((t) => `<li><span>${t.desc}<br><span class="sub">${t.date.slice(5)} · ${categoryName(t.category)}</span></span><strong class="money ${t.amount < 0 ? 'neg' : 'pos'}">${t.amount < 0 ? '−' : '+'}${money(Math.abs(t.amount), true)}</strong></li>`).join('')}
      </ul>
      <p><a href="#/transactions">See all ${state.transactions.length} transactions →</a></p>
      <h2 style="margin-top:18px">Savings goals, at a glance</h2>
      ${topGoals.map((g) => `
        <p><strong>${g.name}</strong> — ${money(g.saved)} of ${money(g.target)} (${percent(g.saved, g.target)})</p>
        <div class="bar"><span style="width:${Math.min(100, Math.round((g.saved / g.target) * 100))}%"></span></div>`).join('')}
      <p><a href="#/goals">All goals and adding money →</a></p>
    </section>
  </div>`;
}
