import Image from "next/image";
import Link from "next/link";
import { NavMenu } from "./nav-menu";

// Figma: "Group 178" — the white 46px bar at the top of every Atlas screen.
export function TopBar() {
  return (
    <header className="sticky top-0 z-40 flex h-[46px] items-center justify-between bg-white px-[9px]">
      {/* Left: menu, logo, language */}
      <div className="flex items-center gap-[5px]">
        <NavMenu />

        <Link href="/atlas" className="flex items-center gap-[2px]">
          <Image src="/iconz-logo.png" alt="" width={16} height={16} priority />
          <span className="text-[9px] font-semibold text-black">iConz</span>
        </Link>

        <button
          type="button"
          className="flex h-[12px] items-center gap-[2px] rounded-[2px] border-[0.5px] border-black/60 px-[3px] text-[7px] leading-none text-black"
        >
          EN
          <svg viewBox="0 0 6 4" className="size-[5px]" aria-hidden="true">
            <path d="M.8.8 3 3.2 5.2.8" fill="none" stroke="currentColor" strokeWidth="1" />
          </svg>
        </button>
      </div>

      {/* Right: status pill + user */}
      <div className="flex items-center gap-[10px] font-hanken">
        <span className="flex items-center gap-[6px] rounded-full border border-[#a7f3d0] bg-[#ecfdf5] px-[9px] py-[3px] text-[10px] leading-[15px] font-medium text-[#047857]">
          <span className="size-[6px] rounded-full bg-[#10b981]" />
          Live Ops
        </span>

        <div className="flex items-center gap-[6px] border-l border-[#e2e8f0] pl-[9px]">
          <span className="grid size-6 place-items-center rounded-full bg-[#1e293b] text-[10px] font-bold text-white">
            AD
          </span>
          <span className="text-[11px] leading-[16.5px] font-semibold text-[#334155]">Admin</span>
        </div>
      </div>
    </header>
  );
}
