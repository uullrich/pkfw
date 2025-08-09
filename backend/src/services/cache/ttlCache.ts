type Entry<T> = { value: T; expiresAt: number };

export class TTLCache<T> {
  private store = new Map<string, Entry<T>>();
  constructor(private ttlMs: number) {}

  get(key: string): T | undefined {
    const entry = this.store.get(key);
    if (!entry) return undefined;
    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return;
    }
    return entry.value;
  }

  set(key: string, value: T) {
    this.store.set(key, { value, expiresAt: Date.now() + this.ttlMs });
  }

  has(key: string) {
    return this.get(key) !== undefined;
  }

  clear() {
    this.store.clear();
  }
}
