"use client";

import { useSyncExternalStore } from "react";

// Shows a stored date the way the design does: "Today", "Yesterday",
// "38d ago", or "Today, 10:45 AM".
//
// Why a client component? Pages are prerendered ahead of time, and Next.js
// (with Cache Components) refuses to read the current time during a
// prerender, because "Today" would be frozen at build time. So the server
// sends a fixed date ("28 Oct 2026"), and the browser swaps in the relative
// text using its own clock and timezone.

type Props = {
  iso: string;
  variant?: "relative" | "datetime";
  className?: string;
};

const DAY_MS = 86_400_000;

// The current day as a string ("Wed Oct 28 2026"). It only changes at
// midnight, so React re-renders rarely. On the server it's null.
const subscribe = () => () => {};
const getToday = () => new Date().toDateString();
const getServerToday = () => null;

export function RelativeTime({ iso, variant = "relative", className }: Props) {
  const today = useSyncExternalStore(subscribe, getToday, getServerToday);
  const date = new Date(iso);

  // Server render (and the first browser render): plain UTC date, so both
  // produce identical HTML and React doesn't report a mismatch.
  const fallback = date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });

  let text = fallback;
  if (today) {
    const startOf = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
    const days = Math.round((startOf(new Date(today)) - startOf(date)) / DAY_MS);
    const time = date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
    const day =
      days <= 0
        ? "Today"
        : days === 1
          ? "Yesterday"
          : variant === "relative"
            ? `${days}d ago`
            : date.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
    text = variant === "datetime" ? `${day}, ${time}` : day;
  }

  return (
    <time dateTime={iso} title={today ? date.toLocaleString() : undefined} className={className}>
      {text}
    </time>
  );
}
