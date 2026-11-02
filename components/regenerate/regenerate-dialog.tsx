"use client";

import Link from "next/link";
import { useEffect, useRef, type ReactNode } from "react";
import { AlertTriangleIcon, BoltIcon, CheckIcon, RefreshIcon, XIcon } from "@/components/ui/icons";
import type { RegenerateState, RegenerateTarget } from "./regenerate-provider";

// The four screens from the Figma: confirm → regenerating → success / failed.
// Built on the native <dialog> element: showModal() gives us the dark
// backdrop, Esc to close, and keeps keyboard focus inside the dialog.

type View = "confirm" | "running" | "succeeded" | "failed";

function toView(state: RegenerateState): View {
  if (state.step === "confirm") return "confirm";
  if (state.step === "starting") return "running";
  if (state.step === "error") return "failed";
  return state.job.status === "running" ? "running" : state.job.status;
}

const header: Record<View, { title: string; icon: ReactNode; iconBox: string; badge?: ReactNode }> = {
  confirm: {
    title: "Regenerate SEO?",
    icon: <RefreshIcon className="size-4 text-brand" />,
    iconBox: "bg-brand/10",
  },
  running: {
    title: "Regenerating SEO",
    icon: <span className="size-4 animate-spin rounded-full border-2 border-blue-200 border-t-brand" />,
    iconBox: "bg-blue-50",
    badge: <Badge dot="bg-blue-500" className="border-blue-200/80 bg-blue-50 text-blue-700">Processing</Badge>,
  },
  succeeded: {
    title: "SEO Regenerated Successfully",
    icon: <CheckIcon className="h-3 w-4 text-emerald-600" />,
    iconBox: "border border-emerald-200 bg-emerald-50",
    badge: <Badge dot="bg-emerald-500" className="border-emerald-200 bg-emerald-50 text-emerald-700">Completed</Badge>,
  },
  failed: {
    title: "SEO Regeneration Failed",
    icon: <AlertTriangleIcon className="size-4 text-red-600" />,
    iconBox: "border border-red-200 bg-red-50",
    badge: <Badge dot="bg-amber-500" className="border-red-200 bg-red-50 text-red-700">Failed</Badge>,
  },
};

type Props = {
  open: boolean;
  target: RegenerateTarget | null;
  state: RegenerateState;
  onClose: () => void;
  onConfirm: () => void;
};

export function RegenerateDialog({ open, target, state, onClose, onConfirm }: Props) {
  const ref = useRef<HTMLDialogElement>(null);

  // Keep the real <dialog> in sync with the `open` prop
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  const view = toView(state);
  const h = header[view];
  const job = state.step === "job" ? state.job : null;
  const before = job?.previousScore ?? target?.score ?? 0;
  const after = job?.newScore;

  return (
    <dialog
      ref={ref}
      aria-labelledby="regenerate-title"
      onClose={onClose} // fires on Esc too
      // Clicking the dark backdrop (outside the white box) closes it
      onClick={(e) => e.target === e.currentTarget && onClose()}
      className="m-auto w-[400px] max-w-[calc(100vw-32px)] rounded-2xl border border-slate-200/80 bg-white p-0 font-hanken text-slate-900 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] backdrop:bg-slate-900/50"
    >
      {target && (
        <div className="flex flex-col gap-4 p-[21px]">
          {/* Header */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <span className={`grid size-8 shrink-0 place-items-center rounded-xl ${h.iconBox}`}>{h.icon}</span>
              <div className="flex flex-col gap-0.5">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  <h2 id="regenerate-title" className="text-base leading-5 font-bold">
                    {h.title}
                  </h2>
                  {h.badge}
                </div>
                <p className="text-[11px] leading-[16.5px] text-slate-400">Project Atlas SEO Intelligence</p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close dialog"
              className="grid size-7 shrink-0 place-items-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700"
            >
              <XIcon className="size-4" />
            </button>
          </div>

          {/* Product */}
          <div className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 p-[13px]">
            <div className="flex min-w-0 items-center gap-2">
              <span className={`size-2 shrink-0 rounded-full ${dotColor(after ?? before)}`} />
              <div className="min-w-0">
                <p className="truncate text-xs leading-4 font-bold">{target.name}</p>
                <p className="truncate font-mono text-[10px] leading-[15px] text-slate-500">
                  {target.sku}
                  {view === "succeeded" && <span className="text-slate-400"> • Last optimized: Just now</span>}
                  {view === "failed" && <span className="text-slate-400"> • Optimization unsuccessful</span>}
                </p>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-1.5">
              <ScorePill score={after ?? before} />
              {view === "succeeded" && after !== undefined && (
                <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] leading-[15px] font-bold text-emerald-800">
                  {after - before >= 0 ? "+" : ""}
                  {after - before}
                </span>
              )}
              {view === "failed" && (
                <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] leading-[15px] font-semibold text-slate-500">
                  Unchanged
                </span>
              )}
            </div>
          </div>

          {/* Message */}
          {view === "confirm" && (
            <p className="text-xs leading-[19.5px] text-slate-600">
              Atlas will generate fresh SEO data for this product. The current SEO data may be replaced.
            </p>
          )}
          {view === "running" && (
            <Message className="border-blue-200/80 bg-blue-50/50" title="Atlas is generating updated SEO data for this product." icon>
              Synthesizing product title, meta descriptions, structured data, and keyword clusters...
            </Message>
          )}
          {view === "succeeded" && (
            <Message className="border-emerald-200 bg-emerald-50/50" title={`Fresh SEO data has been generated for ${target.name}.`}>
              Title tag, meta descriptions, schema markup, and keyword clusters have been successfully refreshed.
            </Message>
          )}
          {view === "failed" && (
            <Message className="border-red-200 bg-red-50/50" title={`Atlas could not regenerate SEO data for ${target.name}.`}>
              {state.step === "error" ? state.message : "The automated pipeline encountered an issue."} Please try again or
              check back shortly.
            </Message>
          )}

          {/* Footer */}
          <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-[13px]">
            {view === "confirm" && (
              <>
                <button type="button" onClick={onClose} className={`${secondaryBtn} rounded-xl px-[17px] py-[9px] font-semibold text-slate-700`}>
                  Cancel
                </button>
                <button type="button" onClick={onConfirm} autoFocus className={`${primaryBtn} rounded-xl px-4 py-2`}>
                  <BoltIcon className="h-[14px] w-3" />
                  Confirm Regeneration
                </button>
              </>
            )}
            {view === "running" && (
              <>
                <p className="mr-auto flex items-center gap-1.5 text-[11px] leading-4 text-slate-500">
                  <span className="size-1.5 animate-pulse rounded-full bg-blue-500" />
                  Processing in background...
                </p>
                <button type="button" onClick={onClose} className={`${secondaryBtn} rounded-lg px-[13px] py-[7px] font-medium text-slate-600`}>
                  Dismiss
                </button>
              </>
            )}
            {view === "succeeded" && (
              <>
                <button type="button" onClick={onClose} className={`${secondaryBtn} rounded-lg px-[13px] py-[7px] font-medium text-slate-600`}>
                  Close
                </button>
                <Link
                  href={`/atlas/seo-intelligence/products/${target.id}`}
                  onClick={onClose}
                  className={`${primaryBtn} rounded-lg px-3.5 py-1.5`}
                >
                  View Updated SEO
                </Link>
              </>
            )}
            {view === "failed" && (
              <>
                <button type="button" onClick={onClose} className={`${secondaryBtn} rounded-lg px-[13px] py-[7px] font-medium text-slate-600`}>
                  Close
                </button>
                <button type="button" onClick={onConfirm} className={`${primaryBtn} rounded-lg px-3.5 py-1.5`}>
                  Try Again
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </dialog>
  );
}

// --- Small pieces ----------------------------------------------------------

const secondaryBtn = "border border-slate-200 bg-white text-xs leading-4 shadow-[0_1px_1px_rgba(0,0,0,0.05)] hover:bg-slate-50";
const primaryBtn =
  "flex items-center gap-1.5 bg-brand text-xs leading-4 font-semibold text-white shadow-[0_1px_1px_rgba(0,0,0,0.05)] hover:bg-brand-dark";

function Badge({ children, dot, className }: { children: ReactNode; dot: string; className: string }) {
  return (
    <span className={`flex items-center gap-1 rounded-full border px-[7px] py-[3px] text-[10px] leading-[15px] font-semibold ${className}`}>
      <span className={`size-1.5 rounded-full ${dot}`} />
      {children}
    </span>
  );
}

function Message({ title, children, className, icon }: { title: string; children: ReactNode; className: string; icon?: boolean }) {
  return (
    <div role="status" className={`flex flex-col gap-1 rounded-xl border p-[15px] ${className}`}>
      <p className="flex items-center gap-2.5 text-xs leading-[16.5px] font-semibold text-slate-800">
        {icon && <span className="size-5 shrink-0 animate-spin rounded-full border-2 border-blue-200 border-t-brand" />}
        {title}
      </p>
      <p className="text-[11px] leading-[17.9px] text-slate-500">{children}</p>
    </div>
  );
}

// Same colour rules as the score pills elsewhere: ≥80 green, 70–79 amber, <70 red
function scoreTone(score: number) {
  if (score >= 80) return { pill: "border-emerald-200 bg-emerald-50 text-emerald-700", dot: "bg-emerald-500" };
  if (score >= 70) return { pill: "border-amber-200 bg-amber-100/80 text-amber-800", dot: "bg-amber-500" };
  return { pill: "border-rose-200 bg-rose-50 text-rose-700", dot: "bg-rose-500" };
}

const dotColor = (score: number) => scoreTone(score).dot;

function ScorePill({ score }: { score: number }) {
  return (
    <span className={`rounded border px-[9px] py-[3px] text-[11px] leading-[16.5px] font-bold ${scoreTone(score).pill}`}>
      {score}/100
    </span>
  );
}
