"use client";

import { useRouter } from "next/navigation";
import { useEffect, useTransition } from "react";

const EVERY_MS = 30_000;

// "Auto-refresh active": asks the server for fresh data every 30 seconds,
// but only while the tab is visible (no wasted requests in background tabs).
export function AutoRefresh() {
  const router = useRouter();
  const [refreshing, startTransition] = useTransition();

  useEffect(() => {
    const timer = setInterval(() => {
      if (document.visibilityState === "visible") startTransition(() => router.refresh());
    }, EVERY_MS);
    return () => clearInterval(timer);
  }, [router]);

  return (
    <p className="flex items-center gap-1.5 text-[10px] leading-[15px] text-slate-400" title="Updates every 30 seconds">
      <span className={`size-1.5 rounded-full ${refreshing ? "animate-pulse bg-brand" : "bg-emerald-400"}`} />
      Auto-refresh active
    </p>
  );
}
