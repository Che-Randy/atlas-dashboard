import { Inter, JetBrains_Mono, Hanken_Grotesk } from "next/font/google";

// next/font downloads these at build time and serves them from your own
// domain, so there's no flash of the wrong font and no request to Google
// from your users' browsers.

// Body text everywhere
export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

// Numbers: stat values, scores, SKUs, code
export const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

// Only used in the top bar ("Live Ops", "Admin")
export const hankenGrotesk = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--font-hanken",
});
