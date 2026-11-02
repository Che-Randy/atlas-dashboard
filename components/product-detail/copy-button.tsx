"use client";

import { useEffect, useState } from "react";
import { CheckIcon, CopyIcon } from "@/components/ui/icons";

// Copies text to the clipboard and shows "Copied!" for two seconds.
// It needs "use client" because the clipboard only exists in the browser.
export function CopyButton({ text, label }: { text: string; label: string }) {
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");

  // Go back to the normal label two seconds after copying
  useEffect(() => {
    if (state === "idle") return;
    const t = setTimeout(() => setState("idle"), 2000);
    return () => clearTimeout(t);
  }, [state]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setState("copied");
    } catch {
      // e.g. the page isn't on https or localhost, or permission was denied
      setState("failed");
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="flex shrink-0 items-center gap-1 rounded border border-blue-200 bg-blue-50/60 px-[9px] py-[3px] text-[10px] leading-[15px] font-bold text-brand hover:bg-blue-100"
    >
      {state === "copied" ? <CheckIcon className="size-[9px]" /> : <CopyIcon className="size-[9px]" />}
      <span aria-live="polite">{state === "copied" ? "Copied!" : state === "failed" ? "Copy failed" : label}</span>
    </button>
  );
}
