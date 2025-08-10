export function normalizeLocationKey(input: string): string {
  return input
    .normalize('NFKC') // normalize Unicode
    .trim() // trim edges
    .replace(/\s+/g, ' ') // collapse inner whitespace
    .toLowerCase(); // case-insensitive
}
