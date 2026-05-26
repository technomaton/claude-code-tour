/** localStorage-backed read-tracking. */

const KEY = "cct.progress.v1";

interface State {
  read: Record<string, true>;
  lastItemId?: string;
}

function load(): State {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { read: {} };
    const parsed = JSON.parse(raw);
    return { read: parsed.read ?? {}, lastItemId: parsed.lastItemId };
  } catch {
    return { read: {} };
  }
}

function save(s: State) {
  try {
    localStorage.setItem(KEY, JSON.stringify(s));
  } catch {
    /* quota / private mode — ignore */
  }
}

let state = load();
const listeners = new Set<() => void>();

function notify() {
  for (const l of listeners) l();
}

export function subscribe(fn: () => void): () => void {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

export function getSnapshot(): State {
  return state;
}

export function markRead(itemId: string) {
  if (state.read[itemId]) return;
  state = { ...state, read: { ...state.read, [itemId]: true } };
  save(state);
  notify();
}

export function markUnread(itemId: string) {
  if (!state.read[itemId]) return;
  const next = { ...state.read };
  delete next[itemId];
  state = { ...state, read: next };
  save(state);
  notify();
}

export function setLast(itemId: string) {
  if (state.lastItemId === itemId) return;
  state = { ...state, lastItemId: itemId };
  save(state);
  notify();
}

export function reset() {
  state = { read: {} };
  save(state);
  notify();
}

export function readCount(): number {
  return Object.keys(state.read).length;
}

export function isRead(itemId: string): boolean {
  return !!state.read[itemId];
}
