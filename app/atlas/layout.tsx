import { TopBar } from "@/components/layout/top-bar";
import { RegenerateSeoProvider } from "@/components/regenerate/regenerate-provider";

// Every page inside app/atlas/ is rendered inside this layout.
// When you move between Atlas pages, the TopBar stays mounted and only
// {children} (the page) changes.
export default function AtlasLayout({ children }: LayoutProps<"/atlas">) {
  return (
    // The provider holds the one "Regenerate SEO" dialog shared by all pages
    <RegenerateSeoProvider>
      <div className="flex min-h-dvh flex-col">
        <TopBar />
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 pt-4 pb-8">{children}</main>
      </div>
    </RegenerateSeoProvider>
  );
}
