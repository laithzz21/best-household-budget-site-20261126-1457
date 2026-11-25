// State: the site's figures start from data.js and live edits are kept in
// localStorage, so a change survives a reload but never leaves this browser.
// Everything is wrapped so the site still works if storage is unavailable
// (for example on a hosted copy that blocks it).

import { CATEGORIES, TRANSACTIONS, GOALS, SUBSCRIPTIONS } from './data.js';

const KEY = 'homeledger-state-v1';

function loadStored() {
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveStored(state) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    // Storage unavailable: the site keeps working for this visit.
  }
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

// The live state: categories, transactions, goals and subscriptions, each
// starting from the shipped figures and overlaid with the user's edits.
export const state = {
  categories: clone(CATEGORIES),
  transactions: clone(TRANSACTIONS),
  goals: clone(GOALS),
  subscriptions: clone(SUBSCRIPTIONS),
  cancelledSubscriptions: [],
};

const stored = loadStored();
if (Array.isArray(stored.categories)) state.categories = stored.categories;
if (Array.isArray(stored.transactions)) state.transactions = stored.transactions;
if (Array.isArray(stored.goals)) state.goals = stored.goals;
if (Array.isArray(stored.cancelledSubscriptions)) state.cancelledSubscriptions = stored.cancelledSubscriptions;

function persist() {
  saveStored({
    categories: state.categories,
    transactions: state.transactions,
    goals: state.goals,
    cancelledSubscriptions: state.cancelledSubscriptions,
  });
}

export function totalIncome() {
  return state.transactions
    .filter((t) => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0);
}

export function totalPlanned() {
  return state.categories.reduce((sum, c) => sum + c.planned, 0);
}

export function totalActual() {
  return state.categories.reduce((sum, c) => sum + c.actual, 0);
}

export function categoryName(id) {
  if (id === 'income') return 'Income';
  const found = state.categories.find((c) => c.id === id);
  return found ? found.name : id;
}

export function categoryColor(id) {
  const found = state.categories.find((c) => c.id === id);
  return found ? found.color : '#7a8a7d';
}

export function addTransaction({ date, desc, category, amount }) {
  state.transactions.unshift({ date, desc, category, amount });
  const cat = state.categories.find((c) => c.id === category);
  if (cat && amount < 0) cat.actual = Math.round((cat.actual + Math.abs(amount)) * 100) / 100;
  persist();
}

export function setPlanned(categoryId, planned) {
  const cat = state.categories.find((c) => c.id === categoryId);
  if (!cat) return;
  cat.planned = Math.max(0, Math.round(Number(planned) * 100) / 100);
  persist();
}

export function addToGoal(goalId, amount) {
  const goal = state.goals.find((g) => g.id === goalId);
  if (!goal) return;
  goal.saved = Math.round((goal.saved + Number(amount)) * 100) / 100;
  persist();
}

export function addGoal({ name, target, saved }) {
  const id = `goal-${Date.now()}`;
  state.goals.push({ id, name, note: 'Added by the household.', target, saved });
  persist();
  return id;
}

export function cancelSubscription(name) {
  if (!state.cancelledSubscriptions.includes(name)) {
    state.cancelledSubscriptions.push(name);
  }
  persist();
}

export function restoreSubscription(name) {
  state.cancelledSubscriptions = state.cancelledSubscriptions.filter((n) => n !== name);
  persist();
}

export function activeSubscriptions() {
  return state.subscriptions.filter((s) => !state.cancelledSubscriptions.includes(s.name));
}

export function resetAll() {
  state.categories = clone(CATEGORIES);
  state.transactions = clone(TRANSACTIONS);
  state.goals = clone(GOALS);
  state.cancelledSubscriptions = [];
  persist();
}
