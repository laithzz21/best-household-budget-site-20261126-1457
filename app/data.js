// HomeLedger data: the Ellis household, November 2026.
// Every figure on the site comes from here, so the dashboard, the budget page,
// the transactions list and the tools all agree with each other. Amounts are in
// US dollars. Spending is stored as a positive number; income is positive too —
// the views decide the sign when they show it.

export const HOUSEHOLD = {
  name: 'The Ellis household',
  members: 'Maya & Jordan Ellis, with Noah (9) and Lily (6)',
  month: 'November 2026',
  currency: 'USD',
};

export const INCOME = [
  { source: 'Maya — primary-school teacher, take-home pay', amount: 3150 },
  { source: 'Jordan — delivery driving, take-home pay', amount: 1700 },
];

export const MONTHS = [
  { month: 'Jun', income: 4800, spent: 4520 },
  { month: 'Jul', income: 4850, spent: 4610 },
  { month: 'Aug', income: 4850, spent: 4780 },
  { month: 'Sep', income: 4900, spent: 4490 },
  { month: 'Oct', income: 4850, spent: 4720 },
  { month: 'Nov', income: 4850, spent: 4654 },
];

// Monthly plan. `planned` is what the family set aside at the start of the
// month; `actual` is what November has cost so far. The two columns add up to
// the income above: every dollar has a job.
export const CATEGORIES = [
  { id: 'housing', name: 'Housing (rent)', planned: 1450, actual: 1450, color: '#1d5c43' },
  { id: 'groceries', name: 'Groceries', planned: 620, actual: 588, color: '#2f7d5b' },
  { id: 'utilities', name: 'Utilities', planned: 210, actual: 204, color: '#4a9b7c' },
  { id: 'transport', name: 'Transport', planned: 340, actual: 312, color: '#c77f1a' },
  { id: 'dining', name: 'Dining out', planned: 180, actual: 214, color: '#b4552d' },
  { id: 'kids', name: 'Kids & school', planned: 260, actual: 245, color: '#2f5d8a' },
  { id: 'health', name: 'Health', planned: 150, actual: 132, color: '#6b7fa3' },
  { id: 'entertainment', name: 'Entertainment', planned: 120, actual: 96, color: '#8a6d9e' },
  { id: 'clothing', name: 'Clothing', planned: 90, actual: 74, color: '#a3907a' },
  { id: 'savings', name: 'Savings', planned: 600, actual: 600, color: '#1d5c43' },
  { id: 'misc', name: 'Household & misc', planned: 130, actual: 118, color: '#7a8a7d' },
  { id: 'fun', name: 'Fun money', planned: 200, actual: 186, color: '#c77f1a' },
  { id: 'giving', name: 'Giving', planned: 100, actual: 100, color: '#2f5d8a' },
  { id: 'home', name: 'Home maintenance', planned: 150, actual: 85, color: '#8a6d4b' },
  { id: 'debt', name: 'Debt payment', planned: 250, actual: 250, color: '#a63a2a' },
];

export const TRANSACTIONS = [
  { date: '2026-11-24', desc: 'Corner Market — weekly groceries', category: 'groceries', amount: -86.4 },
  { date: '2026-11-23', desc: "Maya's salary — November pay", category: 'income', amount: 3150 },
  { date: '2026-11-23', desc: 'Shell — petrol', category: 'transport', amount: -42.1 },
  { date: '2026-11-22', desc: "Luigi's — pizza night", category: 'dining', amount: -38.75 },
  { date: '2026-11-22', desc: 'City Power — electricity bill', category: 'utilities', amount: -131.8 },
  { date: '2026-11-21', desc: "Noah's school trip — museum", category: 'kids', amount: -45 },
  { date: '2026-11-20', desc: 'Jordan — delivery payout, week 3', category: 'income', amount: 412.5 },
  { date: '2026-11-20', desc: 'Riverside Pharmacy', category: 'health', amount: -27.6 },
  { date: '2026-11-19', desc: 'Cinema — family film, 4 tickets', category: 'entertainment', amount: -34 },
  { date: '2026-11-18', desc: 'Corner Market — weekly groceries', category: 'groceries', amount: -74.25 },
  { date: '2026-11-17', desc: 'Bus passes — Maya & Jordan', category: 'transport', amount: -56 },
  { date: '2026-11-16', desc: 'New school shoes for Lily', category: 'clothing', amount: -58.9 },
  { date: '2026-11-15', desc: 'StreamFlix — monthly plan', category: 'entertainment', amount: -15.49 },
  { date: '2026-11-14', desc: 'Plumber — leaking kitchen tap', category: 'home', amount: -85 },
  { date: '2026-11-13', desc: 'Jordan — delivery payout, week 2', category: 'income', amount: 385 },
  { date: '2026-11-12', desc: 'Corner Market — weekly groceries', category: 'groceries', amount: -91.3 },
  { date: '2026-11-11', desc: 'Bookshop — Lily’s birthday book', category: 'fun', amount: -18.99 },
  { date: '2026-11-10', desc: 'Mobile top-up — Jordan', category: 'utilities', amount: -25 },
  { date: '2026-11-09', desc: 'Corner Market — weekly groceries', category: 'groceries', amount: -79.6 },
  { date: '2026-11-08', desc: 'Charity — food bank donation', category: 'giving', amount: -50 },
];

export const GOALS = [
  { id: 'emergency', name: 'Emergency fund', note: 'Three months of essentials, for a broken boiler or a lost job.', target: 6000, saved: 4350 },
  { id: 'holiday', name: 'Summer holiday — the seaside', note: 'A week by the sea in July, train tickets included.', target: 1800, saved: 940 },
  { id: 'washer', name: 'New washing machine', note: 'The old one leaks. Replacing it beats another repair bill.', target: 650, saved: 420 },
  { id: 'college', name: 'Kids’ college fund', note: 'A little each month, started when Noah was born.', target: 10000, saved: 2150 },
];

export const BILLS = [
  { name: 'City Power — electricity', amount: 132, due: '28 Nov', autopay: true },
  { name: 'FastNet — home internet', amount: 65, due: '1 Dec', autopay: true },
  { name: 'SafeDrive — car insurance', amount: 118, due: '3 Dec', autopay: false },
  { name: 'City Water', amount: 48, due: '5 Dec', autopay: true },
  { name: 'StreamFlix', amount: 15.49, due: '15 Dec', autopay: true },
  { name: 'Gym — family membership', amount: 42, due: '18 Dec', autopay: false },
];

export const SUBSCRIPTIONS = [
  { name: 'StreamFlix', amount: 15.49, used: 'Every week — family film night' },
  { name: 'MusicBox', amount: 9.99, used: 'Daily — Maya’s commute' },
  { name: 'Cloud Photos', amount: 2.99, used: 'Backs up every photo automatically' },
  { name: 'GameBox', amount: 12.99, used: 'Noah plays it twice a month' },
  { name: 'News Daily', amount: 6.5, used: 'Jordan reads it most mornings' },
  { name: 'Fitness App', amount: 8.99, used: 'Not opened since September' },
];

export const GUIDE = [
  {
    id: 'fifty-thirty-twenty',
    title: 'The 50/30/20 rule, in plain English',
    body: 'Split take-home pay three ways: about 50% on needs (rent, food, bills, transport), 30% on wants (eating out, films, hobbies) and 20% on savings and paying off debt. The Ellis household runs at roughly 58% needs, 19% wants and 23% savings — rent is high where they live, so the wants share is smaller. Use the rule as a compass, not a law: if your rent alone is 40% of pay, aim for 20% wants and keep the savings share. Try the calculator on the Tools page with your own pay.',
  },
  {
    id: 'pay-yourself-first',
    title: 'Pay yourself first',
    body: 'The most reliable saving trick is also the simplest: move money to savings the day pay lands, before anything else gets a chance to spend it. The Ellises move $600 to savings on the 23rd, the day Maya is paid. Even $50 a month counts — after a year that is $600, and the habit matters more than the amount. Automate it if your bank allows a standing order, so willpower never gets a vote.',
  },
  {
    id: 'money-date',
    title: 'The weekly money date',
    body: 'Fifteen minutes, once a week, same time: open the budget together, check what was spent, and move money between categories if life got in the way. The Ellises do theirs on Sunday evenings. Dining out ran $34 over this month, so they moved $34 from Fun money instead of pretending it did not happen. A budget that never gets adjusted is a budget that gets abandoned.',
  },
  {
    id: 'envelope-method',
    title: 'The envelope method, for the leaky categories',
    body: 'Some categories leak: groceries, dining out, fun money. Give each a fixed amount for the month and stop when it is gone. You can do it with cash envelopes or with a separate account card. Groceries are the Ellis family’s leakiest category, so their $620 sits in its own envelope — when the envelope is empty, meals come from the cupboard. It sounds old-fashioned because it works.',
  },
  {
    id: 'emergency-fund',
    title: 'How big should an emergency fund be?',
    body: 'Start with $1,000 — enough to cover a broken washing machine or a car repair without a credit card. Then build toward three months of essential spending: rent, food, bills and transport, nothing else. For the Ellis household that is about $6,000. It took them fourteen months to reach $4,350. Keep it in a separate savings account you can reach in a day, but not so easily that a sale can tempt you into it.',
  },
  {
    id: 'subscriptions',
    title: 'The subscription audit',
    body: 'Add up every subscription once a quarter. The Ellises pay $56.95 a month — $683 a year — and one of them, the fitness app at $8.99, has not been opened since September. Cancel anything unused for two months; you can always rejoin. The Tools page lists theirs with a running total, so you can see what yours would add up to.',
  },
];
