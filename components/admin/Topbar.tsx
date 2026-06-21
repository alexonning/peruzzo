"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUI } from "@/lib/stores/ui";
import { titleFor } from "@/lib/admin/page-titles";

export function Topbar({
  breadcrumb = "Peruzzo Imports · Administração",
  userEmail,
}: {
  breadcrumb?: string;
  userEmail?: string;
}) {
  const toggleSidebar = useUI((s) => s.toggleSidebar);
  const pathname = usePathname();
  const title = titleFor(pathname);
  const userLabel = userEmail?.split("@")[0] ?? "admin";

  return (
    <div className="bg-paper h-14 sm:h-16 px-3 sm:px-6 lg:px-8 flex items-center gap-3 justify-between border-b border-cream-dark sticky top-0 z-20 shadow-sm">
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        <button
          type="button"
          onClick={toggleSidebar}
          aria-label="Abrir menu"
          className="lg:hidden text-charcoal hover:text-wine p-1.5 -ml-1.5"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-6 h-6">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
        <div className="min-w-0">
          <p className="font-display text-base sm:text-[22px] font-semibold text-charcoal leading-none truncate">
            {title}
          </p>
          <p className="text-[11px] sm:text-xs text-muted mt-1 hidden sm:block">
            {breadcrumb}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        <span className="hidden md:inline-flex bg-cream border border-cream-dark rounded-full px-3.5 py-1 text-xs text-muted">
          👤 {userLabel}
        </span>
        <Link
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-cream text-wine border border-wine px-2.5 sm:px-3.5 py-1.5 rounded-md text-[10px] sm:text-[11px] font-semibold tracking-[1px] sm:tracking-[1.5px] uppercase hover:bg-cream-dark transition-colors flex items-center gap-1.5"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-[13px] h-[13px]">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
            <polyline points="15 3 21 3 21 9" />
            <line x1="10" y1="14" x2="21" y2="3" />
          </svg>
          <span className="hidden sm:inline">Ver Loja</span>
          <span className="sm:hidden">Loja</span>
        </Link>
      </div>
    </div>
  );
}
