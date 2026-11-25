// Transactions and goals views: the full spending record with a working
// add-transaction form and filters, and the savings goals with a working
// "add money" control and a new-goal form.

import { money, prettyDate, signedMoney, percent, escapeHtml } from './format.js';
import { state, categoryName, categoryColor, activeSubscriptions } from './store.js';

let txFilter = { category: 'all', kind: 'all' };

export function setTxFilter(patch) {
  Object.assign(txFilter, patch);
}

export function transactionsView() {
  const filtered = state.transactions.filter((t) => {
    if (txFilter.category !== 'all' && t.category !== txFilter.category) return false;
    if (txFilter.kind === 'spending' && t.amount >= 0) return false;
    if (txFilter.kind === 'income' && t.amount < 0) return false;
    return true;
  });
  const spent = filtered.filter((t) => t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0);
  const earned = filtered.filter((t) => t.amount > 0).reduce((s, t) => s + t.amount, 0);

  return `
  <div class="page-head">
    <h1>Transactions</h1>
    <p>Every dollar in and out, newest first. Add a transaction below and the category totals on the Budget page move with it. Showing ${filtered.length} of ${state.transactions.length} records.</p>
  </div>

  <section class="card">
    <h2>Add a transaction</h2>
    <form id="tx-form">
      <div class="row">
        <div class="field"><label for="tx-date">Date</label><input id="tx-date" name="date" type="date" value="2026-11-25" required></div>
        <div class="field" style="flex:2 1 220px"><label for="tx-desc">What was it?</label><input id="tx-desc" name="desc" type="text" placeholder="e.g. Corner Market — groceries" maxlength="80" required></div>
        <div class="field"><label for="tx-category">Category</label><select id="tx-category" name="category">${state.categories.map((c) => `<option value="${c.id}">${c.name}</option>`).join('')}</select></div>
        <div class="field"><label for="tx-amount">Amount ($)</label><input id="tx-amount" name="amount" type="number" step="0.01" min="0.01" placeholder="25.00" required></div>
        <div class="field"><label for="tx-kind">Direction</label><select id="tx-kind" name="kind"><option value="spending">Money out</option><option value="income">Money in</option></select></div>
      </div>
      <button type="submit">Add transaction</button>
      <span class="hint" id="tx-message" role="status"></span>
    </form>
  </section>

  <section class="card">
    <h2>Filter the list</h2>
    <form id="tx-filter-form">
      <div class="row">
        <div class="field"><label for="tx-filter-category">Category</label><select id="tx-filter-category"><option value="all">All categories</option>${state.categories.map((c) => `<option value="${c.id}" ${txFilter.category === c.id ? 'selected' : ''}>${c.name}</option>`).join('')}<option value="income" ${txFilter.category === 'income' ? 'selected' : ''}>Income</option></select></div>
        <div class="field"><label>Kind</label><div>
          <button type="button" class="small ${txFilter.kind === 'all' ? '' : 'secondary'}" data-kind="all">All</button>
          <button type="button" class="small ${txFilter.kind === 'spending' ? '' : 'secondary'}" data-kind="spending">Spending</button>
          <button type="button" class="small ${txFilter.kind === 'income' ? '' : 'secondary'}" data-kind="income">Income</button>
        </div></div>
      </div>
    </form>
    <p class="hint">In this view: <strong class="money pos">${signedMoney(earned, true)}</strong> in, <strong class="money neg">−${money(spent, true)}</strong> out.</p>
    <div class="table-wrap">
      <table>
        <thead><tr><th>Date</th><th>What</th><th>Category</th><th class="num">Amount</th></tr></thead>
        <tbody>
          ${filtered.map((t) => `<tr>
            <td>${prettyDate(t.date)}</td>
            <td>${escapeHtml(t.desc)}</td>
            <td><span class="dot" style="background:${categoryColor(t.category)}"></span>${categoryName(t.category)}</td>
            <td class="num money ${t.amount < 0 ? 'neg' : 'pos'}">${signedMoney(t.amount, true)}</td>
          </tr>`).join('') || '<tr><td colspan="4">Nothing matches this filter yet.</td></tr>'}
        </tbody>
      </table>
    </div>
  </section>`;
}

export function goalsView() {
  const totalSaved = state.goals.reduce((s, g) => s + g.saved, 0);
  const totalTarget = state.goals.reduce((s, g) => s + g.target, 0);

  return `
  <div class="page-head">
    <h1>Savings goals</h1>
    <p>${money(totalSaved)} saved toward ${money(totalTarget)} of goals. Add money to a goal whenever there is cash left over — even $20 moves the bar.</p>
  </div>

  <div class="grid grid-2">
    ${state.goals.map((g) => {
      const pct = Math.min(100, Math.round((g.saved / g.target) * 100));
      const left = Math.max(0, g.target - g.saved);
      return `<section class="card">
        <h2>${escapeHtml(g.name)}</h2>
        <p class="hint">${escapeHtml(g.note)}</p>
        <p><span class="big money">${money(g.saved)}</span> <small>of ${money(g.target)} · ${percent(g.saved, g.target)}</small></p>
        <div class="bar"><span style="width:${pct}%"></span></div>
        <div class="bar-note"><span>${pct}% there</span><span>${left > 0 ? money(left) + ' to go' : 'Done — fully funded!'}</span></div>
        <form class="goal-add" data-goal="${g.id}" style="margin-top:12px">
          <div class="row">
            <div class="field"><label for="add-${g.id}">Add money ($)</label><input id="add-${g.id}" name="amount" type="number" min="1" step="1" placeholder="50" required></div>
            <div class="field" style="flex:0 0 auto;justify-content:flex-end"><button type="submit" class="small">Add to goal</button></div>
          </div>
        </form>
      </section>`;
    }).join('')}
  </div>

  <section class="card">
    <h2>Start a new goal</h2>
    <form id="goal-form">
      <div class="row">
        <div class="field" style="flex:2 1 220px"><label for="goal-name">What are you saving for?</label><input id="goal-name" name="name" type="text" placeholder="e.g. A new bike for Noah" maxlength="60" required></div>
        <div class="field"><label for="goal-target">Target ($)</label><input id="goal-target" name="target" type="number" min="1" step="1" placeholder="300" required></div>
        <div class="field"><label for="goal-saved">Already saved ($)</label><input id="goal-saved" name="saved" type="number" min="0" step="1" value="0"></div>
      </div>
      <button type="submit">Create goal</button>
      <span class="hint" id="goal-message" role="status"></span>
    </form>
  </section>

  <div class="callout">
    <strong>Which goal first?</strong> The emergency fund comes before the holiday — a broken boiler does not wait for summer. The Ellises put the first $50 of any leftover each month into the emergency fund, then split the rest.
  </div>`;
}

export function subscriptionsSummary() {
  const active = activeSubscriptions();
  const monthly = active.reduce((s, sub) => s + sub.amount, 0);
  const cancelled = state.subscriptions.filter((s) => state.cancelledSubscriptions.includes(s.name));
  const savedMonthly = cancelled.reduce((s, sub) => s + sub.amount, 0);
  return { active, monthly, cancelled, savedMonthly };
}
