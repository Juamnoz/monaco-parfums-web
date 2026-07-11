"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { getBrandGroups, getProductsByBrand } from "@/lib/brands";
import { formatCOP } from "@/lib/format";
import { getSizeOptions } from "@/lib/decants";
import type { Product } from "@/data/products";

const arabesBrands = getBrandGroups("arabes").slice(0, 6);
const nichoBrands = getBrandGroups("nicho");

type ExploreItem = {
  key: string;
  category: Product["category"];
  brand: string;
  label: string;
  href: string;
};

const exploreItems: ExploreItem[] = [
  ...arabesBrands.map((b) => ({
    key: `arabes-${b.name}`,
    category: "arabes" as const,
    brand: b.name,
    label: b.name,
    href: `/perfumes?categoria=arabes&marca=${encodeURIComponent(b.name)}`,
  })),
  ...nichoBrands.map((b) => ({
    key: `nicho-${b.name}`,
    category: "nicho" as const,
    brand: b.name,
    label: `${b.name} — Nicho`,
    href: `/perfumes?categoria=nicho&marca=${encodeURIComponent(b.name)}`,
  })),
];

export function MegaMenu() {
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState<ExploreItem>(exploreItems[0]);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    function onClickOutside(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("mousedown", onClickOutside);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("mousedown", onClickOutside);
    };
  }, []);

  function openNow() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpen(true);
  }

  function closeSoon() {
    closeTimer.current = setTimeout(() => setOpen(false), 150);
  }

  const previewProducts = getProductsByBrand(hovered.category, hovered.brand, 4);

  return (
    <div
      ref={rootRef}
      className="relative"
      onMouseEnter={openNow}
      onMouseLeave={closeSoon}
    >
      <button
        type="button"
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={`flex items-center gap-1.5 text-sm tracking-wide transition-colors ${
          open ? "text-gold" : "text-muted hover:text-gold"
        }`}
      >
        Colección
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        >
          <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <div
        className={`absolute left-1/2 top-full z-50 w-[min(94vw,900px)] -translate-x-1/2 pt-4 transition-all duration-200 ${
          open
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-2 opacity-0"
        }`}
      >
        <div className="grid grid-cols-[190px_1fr] gap-10 rounded-[28px] border border-white/10 bg-background/90 p-8 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8),inset_0_1px_0_0_rgba(255,255,255,0.06)] backdrop-blur-2xl">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-gold">
              Explorar
            </p>
            <ul className="mt-4 space-y-2.5">
              {exploreItems.map((item) => (
                <li key={item.key}>
                  <Link
                    href={item.href}
                    onMouseEnter={() => setHovered(item)}
                    className={`block text-sm transition-colors ${
                      hovered.key === item.key
                        ? "text-gold-soft"
                        : "text-muted hover:text-gold-soft"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              href="/perfumes"
              className="gold-underline mt-6 inline-block text-xs font-medium tracking-wide text-gold hover:text-gold-soft"
            >
              Ver todo el catálogo →
            </Link>
          </div>

          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-muted">
              {hovered.label}
            </p>
            <div
              key={hovered.key}
              className="mt-4 grid animate-[fadeInUp_0.3s_ease] grid-cols-2 gap-4 sm:grid-cols-4"
            >
              {previewProducts.map((p) => {
                const cheapest = getSizeOptions(p.price)[0];
                return (
                  <Link
                    key={p.slug}
                    href={`/perfumes/${p.slug}`}
                    className="group flex flex-col"
                  >
                    <div className="relative aspect-[4/5]">
                      <Image
                        src={p.image}
                        alt={p.name}
                        fill
                        sizes="180px"
                        className="object-contain object-center p-2 drop-shadow-[0_15px_20px_rgba(0,0,0,0.5)] transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="px-1 pb-1">
                      <p className="line-clamp-1 text-xs font-medium text-foreground">
                        {p.name}
                      </p>
                      <p className="mt-0.5 text-xs text-gold-soft">
                        Desde {formatCOP(cheapest.price)}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
