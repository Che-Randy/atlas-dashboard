import type { Metadata } from "next";
import { inter, jetbrainsMono, hankenGrotesk } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Atlas · iConz",
    template: "%s · Atlas",
  },
  description: "AI product SEO intelligence for the iConz marketplace.",
};

// The root layout wraps every page in the app. It only sets up <html>,
// <body> and fonts. The dashboard chrome lives in app/atlas/layout.tsx.
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} ${hankenGrotesk.variable} antialiased`}
    >
      <body className="min-h-dvh font-sans">{children}</body>
    </html>
  );
}
