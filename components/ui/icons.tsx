import type { SVGProps } from "react";

// Small inline icons matching the ones in the Figma. Inline SVG uses
// `currentColor`, so an icon takes the text colour of whatever it sits in.

type IconProps = SVGProps<SVGSVGElement>;

const base = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
} as const;

export const SearchIcon = (p: IconProps) => (
  <svg viewBox="0 0 16 16" {...base} {...p}>
    <circle cx="7" cy="7" r="4.5" />
    <path d="m10.5 10.5 3 3" />
  </svg>
);

export const ChevronDownIcon = (p: IconProps) => (
  <svg viewBox="0 0 8 5" {...base} {...p}>
    <path d="M1 1l3 3 3-3" />
  </svg>
);

export const SlidersIcon = (p: IconProps) => (
  <svg viewBox="0 0 16 16" {...base} {...p}>
    <path d="M2 4h7M12 4h2M2 12h2M7 12h7M2 8h4M9 8h5" />
    <circle cx="10.5" cy="4" r="1.5" />
    <circle cx="5.5" cy="12" r="1.5" />
    <circle cx="7.5" cy="8" r="1.5" />
  </svg>
);

export const ArchiveIcon = (p: IconProps) => (
  <svg viewBox="0 0 16 16" {...base} {...p}>
    <rect x="2" y="2.5" width="12" height="3.5" rx="0.5" />
    <path d="M3 6v7.5h10V6M6.5 9h3" />
  </svg>
);

export const DownloadIcon = (p: IconProps) => (
  <svg viewBox="0 0 16 16" {...base} {...p}>
    <path d="M8 2v8m-3-3 3 3 3-3M2.5 13.5h11" />
  </svg>
);

export const RefreshIcon = (p: IconProps) => (
  <svg viewBox="0 0 16 16" {...base} {...p}>
    <path d="M13.5 6A5.5 5.5 0 0 0 3.2 5M2.5 10a5.5 5.5 0 0 0 10.3 1" />
    <path d="M3 2v3h3M13 14v-3h-3" />
  </svg>
);

export const BoltIcon = (p: IconProps) => (
  <svg viewBox="0 0 8 10" aria-hidden {...p}>
    <path d="M4.6 0 0.5 5.6h3L3 10l4.5-6H4.4L4.6 0Z" fill="currentColor" />
  </svg>
);

export const ChevronRightIcon = (p: IconProps) => (
  <svg viewBox="0 0 4 7" {...base} strokeWidth={1.2} {...p}>
    <path d="M.6.6 3.4 3.5.6 6.4" />
  </svg>
);

export const ArrowLeftIcon = (p: IconProps) => (
  <svg viewBox="0 0 16 14" {...base} strokeWidth={2} {...p}>
    <path d="M15 7H1.5M7 1 1 7l6 6" />
  </svg>
);

export const CheckCircleIcon = (p: IconProps) => (
  <svg viewBox="0 0 16 16" aria-hidden {...p}>
    <circle cx="8" cy="8" r="8" fill="currentColor" />
    <path d="m4.8 8.2 2.2 2.2 4.2-4.6" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const CheckIcon = (p: IconProps) => (
  <svg viewBox="0 0 16 12" {...base} strokeWidth={2.2} {...p}>
    <path d="m1.5 6 4.5 4.5 8.5-9" />
  </svg>
);

export const AlertIcon = (p: IconProps) => (
  <svg viewBox="0 0 16 16" aria-hidden {...p}>
    <circle cx="8" cy="8" r="8" fill="currentColor" />
    <path d="M8 4.2v4.6M8 11.2v.4" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

export const LayersIcon = (p: IconProps) => (
  <svg viewBox="0 0 16 16" {...base} {...p}>
    <path d="M8 2 1.5 5.5 8 9l6.5-3.5L8 2Z" />
    <path d="m1.5 8.5 6.5 3.5 6.5-3.5M1.5 11.5 8 15l6.5-3.5" />
  </svg>
);

export const GlobeIcon = (p: IconProps) => (
  <svg viewBox="0 0 16 16" {...base} {...p}>
    <circle cx="8" cy="8" r="6.5" />
    <path d="M1.5 8h13M8 1.5c2 2 2.8 4.2 2.8 6.5S10 12.5 8 14.5C6 12.5 5.2 10.3 5.2 8S6 3.5 8 1.5Z" />
  </svg>
);

export const TargetIcon = (p: IconProps) => (
  <svg viewBox="0 0 16 16" {...base} {...p}>
    <circle cx="8" cy="8" r="6.5" />
    <circle cx="8" cy="8" r="3.5" />
    <circle cx="8" cy="8" r="0.8" fill="currentColor" />
  </svg>
);

export const TagsIcon = (p: IconProps) => (
  <svg viewBox="0 0 18 16" {...base} {...p}>
    <path d="M1.5 2.5v5l6.5 6.5 5-5-6.5-6.5h-5Z" />
    <circle cx="4.5" cy="5.5" r="1" />
    <path d="m10 2 6 6-5 5" />
  </svg>
);

export const CartIcon = (p: IconProps) => (
  <svg viewBox="0 0 18 16" {...base} strokeWidth={2} {...p}>
    <path d="M1 1.5h2.5l2 9h9l2-6.5H5" />
    <circle cx="7" cy="14" r="1" fill="currentColor" />
    <circle cx="14" cy="14" r="1" fill="currentColor" />
  </svg>
);

export const TextIcon = (p: IconProps) => (
  <svg viewBox="0 0 16 16" {...base} strokeWidth={2} {...p}>
    <path d="M2 3h12M2 8h12M2 13h8" />
  </svg>
);

export const CodeIcon = (p: IconProps) => (
  <svg viewBox="0 0 20 16" {...base} strokeWidth={2} {...p}>
    <path d="m6 3-5 5 5 5M14 3l5 5-5 5M11.5 1.5l-3 13" />
  </svg>
);

export const CopyIcon = (p: IconProps) => (
  <svg viewBox="0 0 16 16" {...base} {...p}>
    <rect x="5" y="5" width="9" height="9" rx="1.5" />
    <path d="M11 5V3.5A1.5 1.5 0 0 0 9.5 2h-6A1.5 1.5 0 0 0 2 3.5v6A1.5 1.5 0 0 0 3.5 11H5" />
  </svg>
);

export const ShareIcon = (p: IconProps) => (
  <svg viewBox="0 0 16 16" {...base} {...p}>
    <circle cx="12" cy="3.5" r="2" />
    <circle cx="4" cy="8" r="2" />
    <circle cx="12" cy="12.5" r="2" />
    <path d="m5.8 7 4.4-2.5M5.8 9l4.4 2.5" />
  </svg>
);

export const HelpCircleIcon = (p: IconProps) => (
  <svg viewBox="0 0 16 16" aria-hidden {...p}>
    <circle cx="8" cy="8" r="8" fill="currentColor" />
    <path d="M6 6.2a2 2 0 1 1 2.8 1.8c-.5.2-.8.6-.8 1.1v.4M8 11.6v.2" fill="none" stroke="white" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

export const ChipIcon = (p: IconProps) => (
  <svg viewBox="0 0 16 16" {...base} {...p}>
    <rect x="3.5" y="3.5" width="9" height="9" rx="1" />
    <rect x="6" y="6" width="4" height="4" />
    <path d="M6 1v2.5M10 1v2.5M6 12.5V15M10 12.5V15M1 6h2.5M1 10h2.5M12.5 6H15M12.5 10H15" />
  </svg>
);

export const SparklesIcon = (p: IconProps) => (
  <svg viewBox="0 0 16 16" {...base} {...p}>
    <path d="m2 14 8-8M9 2v3M7.5 3.5h3M13 6v3M11.5 7.5h3M12 1.5v1.5M11.25 2.25h1.5" />
  </svg>
);

export const FacebookIcon = (p: IconProps) => (
  <svg viewBox="0 0 16 16" aria-hidden {...p}>
    <circle cx="8" cy="8" r="8" fill="#1877f2" />
    <path d="M9 16V10h2l.3-2.3H9V6.3c0-.7.2-1.1 1.1-1.1h1.2V3.1A16 16 0 0 0 9.6 3C8 3 6.8 4 6.8 5.8v1.9H5V10h1.8v6" fill="white" />
  </svg>
);

export const XIcon = (p: IconProps) => (
  <svg viewBox="0 0 16 16" {...base} strokeWidth={1.6} {...p}>
    <path d="m4 4 8 8M12 4l-8 8" />
  </svg>
);

export const AlertTriangleIcon = (p: IconProps) => (
  <svg viewBox="0 0 16 16" {...base} {...p}>
    <path d="M7.1 2.6a1 1 0 0 1 1.8 0l5.4 9.9a1 1 0 0 1-.9 1.5H2.6a1 1 0 0 1-.9-1.5l5.4-9.9Z" />
    <path d="M8 6.5v3M8 11.6v.1" />
  </svg>
);

export const ClockIcon = (p: IconProps) => (
  <svg viewBox="0 0 16 16" {...base} {...p}>
    <circle cx="8" cy="8" r="6.25" />
    <path d="M8 4.5V8l2.5 1.5" />
  </svg>
);
