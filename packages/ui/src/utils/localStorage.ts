export function getItem<T>(key: string, initial: T): T {
  try {
    return JSON.parse(localStorage.getItem(key));
  } catch (_) {
    return initial;
  }
}

export function setItem(key: string, value: unknown) {
  localStorage.setItem(key, JSON.stringify(value));
}
