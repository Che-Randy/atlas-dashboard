import type { SeoProfile } from "@/lib/types";
import { META_LIMIT, TITLE_LIMIT } from "@/lib/format";
import {
  AlertIcon,
  CartIcon,
  CheckIcon,
  ChevronDownIcon,
  CodeIcon,
  FacebookIcon,
  GlobeIcon,
  HelpCircleIcon,
  ShareIcon,
  SparklesIcon,
  TagsIcon,
  TargetIcon,
  TextIcon,
} from "@/components/ui/icons";
import { CharCount, Chip, Divider, Field, SectionHeading } from "./seo-blocks";
import { CopyButton } from "./copy-button";

// Figma: "Section: Generated SEO Data" — one card with six groups.
// Everything here is a server component except <CopyButton>.
export function GeneratedSeoData({ seo }: { seo: SeoProfile }) {
  const jsonLd = JSON.stringify(seo.jsonLd, null, 2);
  const snippetOk = seo.seoTitle.length <= TITLE_LIMIT && seo.metaDescription.length <= META_LIMIT;

  return (
    <section className="overflow-hidden rounded-lg border border-slate-200 bg-white">
      <header className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-3.5 py-2.5">
        <h2 className="flex items-center gap-1.5 text-xs leading-4 font-bold text-slate-900">
          <SparklesIcon className="size-[11px] text-brand" />
          Generated SEO Data
        </h2>
        <span className="text-[10px] leading-[15px] text-slate-500">Read-only object</span>
      </header>

      <div className="flex flex-col gap-3 p-3.5">
        {/* 1. Basic SEO */}
        <div className="flex flex-col gap-2">
          <SectionHeading
            icon={<GlobeIcon />}
            title="Basic SEO Elements"
            aside={
              snippetOk ? (
                <span className="flex items-center gap-1 text-[9px] leading-[13.5px] text-emerald-600">
                  <CheckIcon className="h-[5px] w-[7px]" /> Snippet Preview Optimal
                </span>
              ) : (
                <span className="flex items-center gap-1 text-[9px] leading-[13.5px] text-amber-600">
                  <AlertIcon className="size-2" /> Snippet may be truncated
                </span>
              )
            }
          />
          <Field label="SEO Title" meta={<CharCount text={seo.seoTitle} limit={TITLE_LIMIT} />}>
            <p className="text-xs leading-[16.5px] font-bold text-brand">{seo.seoTitle}</p>
          </Field>
          <div className="grid grid-cols-2 gap-2">
            <Field label="SEO Slug">
              <p className="truncate font-mono text-xs leading-4 font-bold text-slate-800">{seo.slug}</p>
            </Field>
            <Field label="Focus Keyword">
              <span className="mt-0.5 flex w-fit max-w-full items-center gap-1 rounded border border-slate-200 bg-white px-[7px] py-[3px]">
                <TargetIcon className="size-[9px] shrink-0 text-brand" />
                <span className="truncate text-[11px] leading-[16.5px] font-bold text-slate-900">{seo.focusKeyword}</span>
              </span>
            </Field>
          </div>
          <Field label="Meta Description" meta={<CharCount text={seo.metaDescription} limit={META_LIMIT} />}>
            <p className="text-[11px] leading-[17.9px] text-slate-700">{seo.metaDescription}</p>
          </Field>
        </div>

        <Divider />

        {/* 2. Keywords & intent */}
        <div className="flex flex-col gap-2">
          <SectionHeading icon={<TagsIcon />} title="Keyword Clusters & Search Intent" />
          <Field label="Secondary Keywords">
            <div className="mt-0.5 flex flex-wrap gap-1">
              {seo.secondaryKeywords.map((k) => (
                <Chip key={k}>{k}</Chip>
              ))}
            </div>
          </Field>
          <div className="grid grid-cols-2 gap-2">
            <Field label="Entity Keywords">
              <div className="mt-0.5 flex flex-wrap gap-1">
                {seo.entityKeywords.map((k) => (
                  <Chip key={k} tone="entity">
                    {k}
                  </Chip>
                ))}
              </div>
            </Field>
            <Field label="Search Intent">
              <span className="mt-0.5 flex w-fit items-center gap-1 rounded border border-emerald-300 bg-emerald-100 px-[9px] py-[3px] text-[10px] leading-[15px] font-bold text-emerald-800">
                <CartIcon className="h-2 w-[9px] shrink-0" />
                {seo.searchIntent.label}
              </span>
              <p className="text-[9px] leading-[13.5px] text-slate-400">{seo.searchIntent.note}</p>
            </Field>
          </div>
        </div>

        <Divider />

        {/* 3. Summary & image SEO */}
        <div className="flex flex-col gap-2">
          <SectionHeading icon={<TextIcon />} title="AI Product Summary & Image SEO" />
          <Field label="AI Product Summary" meta="Synthesized for SERP & Overview">
            <p className="mt-1 rounded border border-slate-200 bg-white p-[9px] text-[11px] leading-[18px] text-slate-700">
              {seo.aiSummary}
            </p>
          </Field>
          <Field label="Image Alt Text (Primary Thumbnail)">
            <p className="rounded border border-slate-200 bg-white px-[7px] py-[7px] font-mono text-[11px] leading-4 text-slate-800">
              {seo.imageAlt}
            </p>
          </Field>
        </div>

        <Divider />

        {/* 4. JSON-LD */}
        <div className="flex flex-col gap-1.5">
          <SectionHeading
            icon={<CodeIcon />}
            title="Structured Data (Schema.org / Product)"
            aside={<CopyButton text={jsonLd} label="Copy JSON-LD" />}
          />
          {/* overflow-x-auto: long lines scroll sideways instead of breaking the layout */}
          <pre className="overflow-x-auto rounded border border-slate-800 bg-slate-900 p-[11px] font-mono text-[10px] leading-[13.75px] text-slate-200">
            {jsonLd}
          </pre>
        </div>

        <Divider />

        {/* 5. Social & technical */}
        <div className="flex flex-col gap-2">
          <SectionHeading icon={<ShareIcon />} title="Social Metadata & Technical Tags" />
          <div className="grid grid-cols-2 gap-2">
            <Field
              label={
                <span className="flex items-center gap-1 font-bold text-slate-700">
                  <FacebookIcon className="size-[10px]" /> Open Graph (og:tags)
                </span>
              }
            >
              <MetaTag name="og:title" value={seo.openGraph.title} />
              <MetaTag name="og:description" value={seo.openGraph.description} />
            </Field>
            <Field label={<span className="font-bold text-slate-700">Twitter Card</span>}>
              <MetaTag name="twitter:card" value={seo.twitter.card} mono />
              <MetaTag name="twitter:title" value={seo.twitter.title} />
            </Field>
            <Field label="Canonical URL">
              <p className="truncate font-mono text-[9px] leading-[13.5px] text-slate-700">{seo.canonicalUrl}</p>
            </Field>
            <Field label="Robots Directives">
              <div className="flex flex-wrap items-center gap-1">
                {seo.robots.map((r) => (
                  <span key={r} className="rounded border border-emerald-200 bg-emerald-50 px-1.5 font-mono text-[9px] leading-[14px] font-bold text-emerald-700">
                    {r}
                  </span>
                ))}
                <span className="rounded bg-slate-100 px-1 font-mono text-[9px] leading-[13.5px] text-slate-500">
                  {seo.robotsExtra}
                </span>
              </div>
            </Field>
          </div>
        </div>

        <Divider />

        {/* 6. FAQ — native <details>: opens and closes with no JavaScript */}
        <div className="flex flex-col gap-1.5">
          <SectionHeading icon={<HelpCircleIcon />} title={`Generated FAQ Accordion (${seo.faqs.length} entries)`} />
          <div className="divide-y divide-slate-200 rounded border border-slate-200">
            {seo.faqs.map((faq, i) => (
              <details key={faq.question} open={i === 0} className="group">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-2 px-2 py-2 hover:bg-slate-50 [&::-webkit-details-marker]:hidden">
                  <span className="text-[11px] leading-[17px] font-bold text-slate-900">{faq.question}</span>
                  <ChevronDownIcon className="h-[5px] w-2 shrink-0 text-slate-400 transition-transform group-open:rotate-180" />
                </summary>
                <p className="px-2 pb-2 text-[10px] leading-[16.5px] text-slate-600">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function MetaTag({ name, value, mono }: { name: string; value: string; mono?: boolean }) {
  return (
    <div className="mt-1 min-w-0">
      <p className="text-[9px] leading-[13.5px] text-slate-400">{name}</p>
      <p className={`truncate text-[10px] leading-[15px] text-slate-800 ${mono ? "font-mono" : ""}`}>{value}</p>
    </div>
  );
}
