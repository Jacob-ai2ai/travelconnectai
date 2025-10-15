export type SummaryItem = {
  id: string;
  type: 'product' | 'experience' | 'event' | 'stay' | 'service';
  title: string;
  price: number;
  qty: number;
  image?: string;
  meta?: Record<string, any>;
};

const KEY = 'tripSummaryItems';

export function readSummary(): SummaryItem[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    return JSON.parse(raw) as SummaryItem[];
  } catch (e) {
    return [];
  }
}

export function writeSummary(items: SummaryItem[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(items));
    // notify same-window listeners
    try { window.dispatchEvent(new Event('tripSummaryUpdated')); } catch (e) {}
  } catch (e) {}
}

export function addSummaryItem(item: Omit<SummaryItem, 'qty'> & { qty?: number }) {
  const list = readSummary();
  const key = `${item.type}:${item.id}`;
  const existingIndex = list.findIndex((it) => `${it.type}:${it.id}` === key && JSON.stringify(it.meta || {}) === JSON.stringify(item.meta || {}));
  if (existingIndex >= 0) {
    list[existingIndex].qty += item.qty ?? 1;
  } else {
    list.push({ id: item.id, type: item.type, title: item.title, price: item.price, qty: item.qty ?? 1, image: item.image, meta: item.meta ?? {} });
  }
  writeSummary(list);
  return list;
}

export function removeSummaryItem(type: string, id: string, meta?: Record<string, any>) {
  const list = readSummary();
  const next = list.filter((it) => !(it.type === type && it.id === id && JSON.stringify(it.meta || {}) === JSON.stringify(meta || {})));
  writeSummary(next);
  return next;
}

export function changeSummaryQty(type: string, id: string, delta: number, meta?: Record<string, any>) {
  const list = readSummary();
  const idx = list.findIndex((it) => it.type === type && it.id === id && JSON.stringify(it.meta || {}) === JSON.stringify(meta || {}));
  if (idx >= 0) {
    list[idx].qty = Math.max(0, list[idx].qty + delta);
    if (list[idx].qty === 0) list.splice(idx, 1);
    writeSummary(list);
  }
  return list;
}

export function clearSummary() {
  writeSummary([]);
}

export function summaryTotal() {
  const list = readSummary();
  return list.reduce((s, it) => s + it.price * it.qty, 0);
}
