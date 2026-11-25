// HomeLedger's entry point: hash routing plus the wiring that makes every
// control do what it says. Pages:
//
//   #/                dashboard — the month at a glance
//   #/budget          the monthly plan, with editable amounts
//   #/transactions    the spending record, add + filter
//   #/goals           savings goals, add money + new goals
//   #/tools           calculators and the subscription audit
//   #/guide           plain-English budgeting guide
//
// window.__shotReady is false while a page renders and true once it is on
// screen, so a screenshot script knows when to capture.

import { dashboardView } from './views-dashboard.js';
import { budgetView } from './views-budget.js';
import { transactionsView, goalsView, setTxFilter } from './views-lists.js';
import { toolsView, guideView } from './views-tools.js';
import { money } from './format.js';
import {
  addTransaction,
  setPlanned,
  addToGoal,
  addGoal,
  cancelSubscription,
  restoreSubscription,
} from './store.js';

const app = document.getElementById('app');

const ROUTES = {
  '': { title: 'HomeLedger — the Ellis household budget', view: dashboardView, nav: 'dashboard' },
  budget: { title: 'The November budget | HomeLedger', view: budgetView, nav: 'budget' },
  transactions: { title: 'Transactions | HomeLedger', view: transactionsView, nav: 'transactions' },
  goals: { title: 'Savings goals | HomeLedger', view: goalsView, nav: 'goals' },
  tools: { title: 'Budget tools | HomeLedger', view: toolsView, nav: 'tools' },
  guide: { title: 'The budgeting guide | HomeLedger', view: guideView, nav: 'guide' },
};

function currentRoute() {
  const match = window.location.hash.match(/^#\/([a-z-]*)/);
  const key = match ? match[1] : '';
  return ROUTES[key] ?? { title: 'Page not found | HomeLedger', view: notFoundView, nav: '' };
}

function notFoundView() {
  return `<div class="page-head"><h1>That page is not in the house</h1>
  <p>HomeLedger has a dashboard, a budget, transactions, goals, tools and a guide — all linked in the bar above. <a href="#/">Back to the dashboard →</a></p></div>`;
}

function markNav(active) {
  document.querySelectorAll('[data-nav]').forEach((link) => {
    link.classList.toggle('active', link.dataset.nav === active);
  });
}

function render() {
  window.__shotReady = false;
  const route = currentRoute();
  document.title = route.title;
  app.innerHTML = route.view();
  markNav(route.nav);
  window.scrollTo(0, 0);
  window.__shotReady = true;
}

// --- Forms and controls, wired once on the app element ---------------

app.addEventListener('submit', (event) => {
  const form = event.target;
  event.preventDefault();

  if (form.id === 'tx-form') {
    const data = new FormData(form);
    addTransaction({
      date: data.get('date'),
      desc: String(data.get('desc')).trim(),
      category: String(data.get('category')),
      amount: (data.get('kind') === 'income' ? 1 : -1) * Math.abs(Number(data.get('amount'))),
    });
    document.getElementById('tx-message').textContent = 'Added — the totals on the Budget page moved with it.';
    render();
    return;
  }

  if (form.id === 'goal-form') {
    const data = new FormData(form);
    addGoal({
      name: String(data.get('name')).trim(),
      target: Number(data.get('target')),
      saved: Number(data.get('saved')) || 0,
    });
    document.getElementById('goal-message').textContent = 'Goal created.';
    render();
    return;
  }

  if (form.classList.contains('goal-add')) {
    const amount = Number(new FormData(form).get('amount'));
    addToGoal(form.dataset.goal, amount);
    render();
    return;
  }

  if (form.id === 'split-form') {
    const pay = Number(document.getElementById('split-pay').value) || 0;
    document.getElementById('split-needs').textContent = money(Math.round(pay * 0.5));
    document.getElementById('split-wants').textContent = money(Math.round(pay * 0.3));
    document.getElementById('split-savings').textContent = money(Math.round(pay * 0.2));
    document.getElementById('split-note').textContent = `On a pay of ${money(pay)} that is ${money(Math.round(pay * 0.5))} for needs, ${money(Math.round(pay * 0.3))} for wants and ${money(Math.round(pay * 0.2))} for savings and debt. Adjust the shares if your rent is unusually high or low.`;
    return;
  }

  if (form.id === 'fund-form') {
    const essentials = Number(document.getElementById('fund-essentials').value) || 0;
    const months = Number(document.getElementById('fund-months').value) || 3;
    document.getElementById('fund-result').textContent = `Target: ${money(essentials * months)} — ${months} month${months > 1 ? 's' : ''} of essentials.`;
    return;
  }

  if (form.id === 'afford-form') {
    const price = Number(document.getElementById('afford-price').value) || 0;
    const months = Number(document.getElementById('afford-months').value) || 1;
    const spare = Number(document.getElementById('afford-spare').value) || 0;
    const monthly = price / months;
    const fits = monthly <= spare;
    document.getElementById('afford-result').textContent = `Monthly payment: ${money(monthly, true)} — ${fits ? `fits in ${money(spare)} of spare cash.` : `more than the ${money(spare)} of spare cash. Not yet.`}`;
    document.getElementById('afford-note').textContent = fits
      ? `That leaves ${money(spare - monthly, true)} of spare cash a month. Saving first still costs nothing extra.`
      : `Short by ${money(monthly - spare, true)} a month. Stretch it over more months, or save for it first.`;
  }
});

app.addEventListener('change', (event) => {
  const target = event.target;
  if (target.matches('[data-plan]')) {
    setPlanned(target.dataset.plan, Number(target.value));
    render();
    return;
  }
  if (target.id === 'tx-filter-category') {
    setTxFilter({ category: target.value });
    render();
  }
});

app.addEventListener('click', (event) => {
  const button = event.target.closest('button');
  if (!button) return;

  if (button.dataset.kind) {
    setTxFilter({ kind: button.dataset.kind });
    render();
    return;
  }
  if (button.dataset.cancelSub) {
    cancelSubscription(button.dataset.cancelSub);
    render();
    return;
  }
  if (button.dataset.restoreSub) {
    restoreSubscription(button.dataset.restoreSub);
    render();
  }
});

window.addEventListener('hashchange', render);
render();
