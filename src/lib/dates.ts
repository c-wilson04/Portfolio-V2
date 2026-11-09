const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

/** Year and month from "2026-09-28", "2025-01-14T00:00:00.000Z" or "October 2026". */
function parts(input: string): { year: number; month: number } | null {
  const iso = /^(\d{4})-(\d{2})/.exec(input);
  if (iso) return { year: Number(iso[1]), month: Number(iso[2]) - 1 };
  const named = /^([A-Za-z]+)\s+(\d{4})$/.exec(input.trim());
  if (named) {
    const month = MONTHS.findIndex((m) => m.toLowerCase() === named[1].toLowerCase());
    if (month >= 0) return { year: Number(named[2]), month };
  }
  return null;
}

/** Every post date shows the same way: "September 2026". */
export function formatPostDate(input: string): string {
  const p = parts(input);
  return p ? `${MONTHS[p.month]} ${p.year}` : input;
}

/** Sort key, newest first when sorted descending. Unknown dates sort last. */
export function dateKey(input: string): number {
  const p = parts(input);
  return p ? p.year * 12 + p.month : -1;
}
