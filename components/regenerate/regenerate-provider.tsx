"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { checkSeoRegeneration, startSeoRegeneration } from "@/lib/actions";
import type { Product, RegenerationJob } from "@/lib/types";
import { RegenerateDialog } from "./regenerate-dialog";

// One "Regenerate SEO" dialog for the whole Atlas section. It lives in the
// Atlas layout, so it keeps running when you change page or when a filter
// hides the row you clicked, and "Dismiss" can leave the job running in
// the background.
//
// Any button inside Atlas opens it with:  useRegenerateSeo().open(product)

export type RegenerateTarget = Pick<Product, "id" | "name" | "sku" | "score" | "status">;

export type RegenerateState =
  | { step: "confirm" } // "Regenerate SEO?"
  | { step: "starting" } // waiting for the server to create the job
  | { step: "job"; job: RegenerationJob } // running, succeeded or failed
  | { step: "error"; message: string }; // the request itself failed

const POLL_EVERY_MS = 1500;

const RegenerateContext = createContext<{ open: (product: RegenerateTarget) => void } | null>(null);

export function useRegenerateSeo() {
  const ctx = useContext(RegenerateContext);
  if (!ctx) throw new Error("useRegenerateSeo must be used inside <RegenerateSeoProvider>");
  return ctx;
}

export function RegenerateSeoProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [target, setTarget] = useState<RegenerateTarget | null>(null);
  const [state, setState] = useState<RegenerateState>({ step: "confirm" });

  const busy = state.step === "starting" || (state.step === "job" && state.job.status === "running");

  const open = useCallback(
    (product: RegenerateTarget) => {
      // A job is still running: show it again instead of starting another
      if (!busy) {
        setTarget(product);
        setState({ step: "confirm" });
      }
      setIsOpen(true);
    },
    [busy],
  );

  // "Confirm Regeneration" and "Try Again"
  async function start() {
    if (!target) return;
    setState({ step: "starting" });
    const res = await startSeoRegeneration(target.id);
    setState(res.ok ? { step: "job", job: res.data } : { step: "error", message: res.error });
  }

  // While a job runs, ask the server for its status every 1.5 seconds.
  // With Firebase this could become a live Firestore listener instead.
  const runningJobId = state.step === "job" && state.job.status === "running" ? state.job.id : null;
  useEffect(() => {
    if (!runningJobId) return;
    let cancelled = false;
    const timer = setInterval(async () => {
      const res = await checkSeoRegeneration(runningJobId);
      if (cancelled) return;
      if (!res.ok) setState({ step: "error", message: res.error });
      else if (res.data.status !== "running") setState({ step: "job", job: res.data });
    }, POLL_EVERY_MS);
    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, [runningJobId]);

  const value = useMemo(() => ({ open }), [open]);

  return (
    <RegenerateContext value={value}>
      {children}
      <RegenerateDialog
        open={isOpen}
        target={target}
        state={state}
        onClose={() => setIsOpen(false)}
        onConfirm={start}
      />
    </RegenerateContext>
  );
}
