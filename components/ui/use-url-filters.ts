"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useOptimistic, useRef, useState, useTransition } from "react";

// Shared logic for list pages whose search, filters and page number live in
// the URL (Products, Re-optimization). Filters never hold results: they
// only change the URL, and the server reads it and sends back the rows.
//
//   const f = useUrlFilters();
//   f.get("status", "all")        current value (updates instantly on change)
//   f.setFilter("status", "stale") change a filter → back to page 1
//   f.text / f.setSearch(...)     the search box, debounced 300ms
//   f.isPending                   true while the server works

const DEFAULTS = new Set(["", "all", "any"]); // values left out of the URL

export function useUrlFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // Show newly picked options straight away, before the server answers
  const [optimisticQuery, setOptimisticQuery] = useOptimistic(searchParams.toString());

  // The search box keeps its own text so typing feels instant
  const [text, setText] = useState(searchParams.get("q") ?? "");
  const debounce = useRef<ReturnType<typeof setTimeout>>(undefined);

  function nextUrl(base: string, key: string, value: string) {
    const params = new URLSearchParams(base);
    if (DEFAULTS.has(value)) params.delete(key);
    else params.set(key, value);
    params.delete("page"); // new filters → back to page 1
    return params.toString();
  }

  function go(qs: string) {
    // replace (not push) so every change doesn't add a Back-button entry
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  return {
    isPending,
    text,

    get(key: string, fallback: string) {
      return new URLSearchParams(optimisticQuery).get(key) ?? fallback;
    },

    setFilter(key: string, value: string) {
      const qs = nextUrl(searchParams.toString(), key, value);
      startTransition(() => {
        setOptimisticQuery(qs);
        go(qs);
      });
    },

    setSearch(value: string) {
      setText(value);
      clearTimeout(debounce.current);
      debounce.current = setTimeout(() => {
        startTransition(() => go(nextUrl(searchParams.toString(), "q", value.trim())));
      }, 300);
    },
  };
}
