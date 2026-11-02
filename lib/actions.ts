"use server";

// Server Actions: functions that run on the server but can be called from
// client components like normal async functions. Next.js turns each one
// into a POST endpoint, which means ANYONE could call them, so always
// check the input (and, once auth exists, who is calling).

import { updateTag } from "next/cache";
import { getRegenerationJob, startRegeneration, tags } from "@/lib/data";
import type { ActionResult, RegenerationJob } from "@/lib/types";

const isId = (v: unknown): v is string => typeof v === "string" && /^[\w-]{1,100}$/.test(v);

// Refresh every cached read that shows this product, so pages behind the
// dialog update straight away (status badge, score, "Last Optimized").
function refreshProduct(productId: string) {
  updateTag(tags.product(productId));
  updateTag(tags.products);
  updateTag(tags.stats);
}

/** "Confirm Regeneration": starts a background job and returns at once. */
export async function startSeoRegeneration(productId: unknown): Promise<ActionResult<RegenerationJob>> {
  if (!isId(productId)) return { ok: false, error: "Invalid product." };
  // FIREBASE: verify the caller is a signed-in admin here (Firebase Auth).
  try {
    const job = await startRegeneration(productId);
    refreshProduct(productId); // status → "Processing"
    return { ok: true, data: job };
  } catch (err) {
    console.error("startSeoRegeneration failed", err);
    return { ok: false, error: "Could not start regeneration. Please try again." };
  }
}

/** Polled by the dialog every few seconds until the job finishes. */
export async function checkSeoRegeneration(jobId: unknown): Promise<ActionResult<RegenerationJob>> {
  if (!isId(jobId)) return { ok: false, error: "Invalid job." };
  try {
    const job = await getRegenerationJob(jobId);
    if (!job) return { ok: false, error: "Job not found." };
    if (job.status !== "running") refreshProduct(job.productId); // show the new score
    return { ok: true, data: job };
  } catch (err) {
    console.error("checkSeoRegeneration failed", err);
    return { ok: false, error: "Could not check the job status." };
  }
}
