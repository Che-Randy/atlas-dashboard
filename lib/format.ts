// Turns raw data values into display text. Keeping this in one place means
// the data layer stores plain numbers and every screen formats them the
// same way.

const integer = new Intl.NumberFormat("en-US");

export const formatCount = (n: number) => integer.format(n); // 12480 → "12,480"

export const formatPercent = (ratio: number, digits = 0) => `${(ratio * 100).toFixed(digits)}%`; // 0.82 → "82%"

export const formatSeconds = (s: number) => `${s.toFixed(1)}s`; // 4.8 → "4.8s"

export const formatUsd = (n: number) => `$${n.toFixed(2)}`; // 0.03 → "$0.03"

export const formatHttp = (indexable: boolean, status: number) =>
  `${indexable ? "Yes" : "No"} (${status}${status === 200 ? " OK" : ""})`; // "Yes (200 OK)"

/** Clamp a value into 0–100 for progress bar widths */
export const toPercent = (value: number, max: number) => Math.max(0, Math.min(100, (value / max) * 100));

export const TITLE_LIMIT = 60;
export const META_LIMIT = 160;

export function scoreLabel(score: number) {
  if (score >= 90) return "Excellent";
  if (score >= 80) return "Good";
  if (score >= 70) return "Fair";
  return "Poor";
}
