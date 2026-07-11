"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { createPortal } from "react-dom";
import { useRouter, usePathname } from "next/navigation";
import { getBrandGroups } from "@/lib/brands";
import { products } from "@/data/products";
import { formatCOP } from "@/lib/format";
import { getSizeOptions } from "@/lib/decants";
import { CartTriggerButton } from "@/components/cart-trigger-button";

const arabesBrands = getBrandGroups("arabes").slice(0, 8);
const nichoBrands = getBrandGroups("nicho");
const arabesFeatured = products.filter((p) => p.category === "arabes" && !p.isTester).slice(0, 4);
const nichoFeatured = products.filter((p) => p.category === "nicho").slice(0, 4);

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<"arabes" | "nicho">("arabes");
  const [q, setQ] = useState("");
  const [mounted, setMounted] = useState(false);
  const [compact, setCompact] = useState(false);
  const lastY = useRef(0);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => setMounted(true), []);
  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    lastY.current = window.scrollY;
    function onScroll() {
      const y = window.scrollY;
      if (y > lastY.current && y > 80) setCompact(true);
      else if (y < lastY.current) setCompact(false);
      lastY.current = y;
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function submitSearch(e: FormEvent) {
    e.preventDefault();
    setOpen(false);
    router.push(`/perfumes${q.trim() ? `?q=${encodeURIComponent(q.trim())}` : ""}`);
  }

  const brands = tab === "arabes" ? arabesBrands : nichoBrands;
  const featured = tab === "arabes" ? arabesFeatured : nichoFeatured;

  return (
    <>
      <div
        className="fixed inset-x-4 bottom-4 z-40 flex justify-center md:hidden"
        style={{ marginBottom: "env(safe-area-inset-bottom)" }}
      >
        <nav
          className={`flex w-full max-w-xs items-center justify-around rounded-full border border-white/10 bg-background/95 shadow-[0_10px_35px_-8px_rgba(0,0,0,0.7)] backdrop-blur-lg transition-all duration-500 ease-out ${
            compact ? "gap-1 px-3 py-1.5 scale-[0.9]" : "gap-1 px-4 py-2.5"
          }`}
        >
          <Link
            href="/"
            className="flex flex-col items-center gap-0.5 px-3 py-1 text-muted transition-colors active:text-gold"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className={`transition-transform duration-500 ease-out ${compact ? "scale-[0.86]" : "scale-100"}`}
            >
              <path d="M4 11.5 12 4l8 7.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M6 10v9a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-9" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span
              className={`overflow-hidden text-[10px] tracking-wide transition-all duration-500 ease-out ${
                compact ? "max-h-0 opacity-0" : "max-h-4 opacity-100"
              }`}
            >
              Inicio
            </span>
          </Link>

          <button
            onClick={() => setOpen(true)}
            aria-label="Abrir colección"
            className="flex flex-col items-center gap-0.5 px-3 py-1 text-muted transition-colors active:text-gold"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className={`transition-transform duration-500 ease-out ${compact ? "scale-[0.86]" : "scale-100"}`}
            >
              <rect x="3.5" y="3.5" width="7" height="7" rx="1.5" />
              <rect x="13.5" y="3.5" width="7" height="7" rx="1.5" />
              <rect x="3.5" y="13.5" width="7" height="7" rx="1.5" />
              <rect x="13.5" y="13.5" width="7" height="7" rx="1.5" />
            </svg>
            <span
              className={`overflow-hidden text-[10px] tracking-wide transition-all duration-500 ease-out ${
                compact ? "max-h-0 opacity-0" : "max-h-4 opacity-100"
              }`}
            >
              Colección
            </span>
          </button>

          <CartTriggerButton variant="tabbar" compact={compact} />
        </nav>
      </div>

      {mounted &&
        createPortal(
          <>
            <div
              onClick={() => setOpen(false)}
              className={`fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
                open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
              }`}
            />

            <div
              className={`fixed inset-x-0 bottom-0 z-[70] max-h-[85vh] overflow-y-auto rounded-t-[28px] border-t border-border bg-background shadow-[0_-10px_60px_rgba(0,0,0,0.6)] transition-transform duration-300 ease-[cubic-bezier(0.65,0,0.35,1)] md:hidden ${
                open ? "translate-y-0" : "translate-y-full"
              }`}
            >
              <div className="flex justify-center pb-1 pt-3">
                <span className="h-1 w-10 rounded-full bg-white/15" />
              </div>

              <div className="flex items-center justify-between px-6 pb-2">
                <h2 className="font-display text-lg text-foreground">Colección</h2>
                <button
                  aria-label="Cerrar"
                  onClick={() => setOpen(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-muted transition-colors hover:border-gold/40 hover:text-gold-soft"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                    <path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" />
                  </svg>
                </button>
              </div>

              <form onSubmit={submitSearch} className="px-6 pb-4">
                <input
                  type="text"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Buscar por nombre o marca…"
                  className="w-full rounded-full border border-border bg-surface px-5 py-2.5 text-sm text-foreground placeholder:text-muted focus:border-gold focus:outline-none"
                />
              </form>

              <div className="flex gap-2 px-6 pb-4">
                {(["arabes", "nicho"] as const).map((key) => (
                  <button
                    key={key}
                    onClick={() => setTab(key)}
                    className={`rounded-full border px-4 py-1.5 text-xs tracking-wide transition-colors ${
                      tab === key
                        ? "border-gold bg-gold text-background"
                        : "border-border text-muted hover:border-gold/50 hover:text-gold-soft"
                    }`}
                  >
                    {key === "arabes" ? "Árabes" : "Nicho"}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-3 px-6">
                {featured.map((p) => {
                  const cheapest = getSizeOptions(p.price)[0];
                  return (
                    <Link
                      key={p.slug}
                      href={`/perfumes/${p.slug}`}
                      onClick={() => setOpen(false)}
                      className="flex flex-col"
                    >
                      <div className="relative aspect-square overflow-hidden rounded-2xl bg-white/5">
                        <Image
                          src={p.image}
                          alt={p.name}
                          fill
                          sizes="180px"
                          className="object-contain p-4"
                        />
                      </div>
                      <p className="mt-2 line-clamp-1 text-xs text-foreground">{p.name}</p>
                      <p className="text-xs text-gold-soft">Desde {formatCOP(cheapest.price)}</p>
                    </Link>
                  );
                })}
              </div>

              <div className="mt-5 border-t border-border px-6 py-5">
                <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.25em] text-gold">
                  Marcas {tab === "arabes" ? "Árabes" : "de Nicho"}
                </p>
                <ul className="grid grid-cols-2 gap-x-4 gap-y-2.5">
                  {brands.map((b) => (
                    <li key={b.name}>
                      <Link
                        href={`/perfumes?categoria=${tab}&marca=${encodeURIComponent(b.name)}`}
                        onClick={() => setOpen(false)}
                        className="text-sm text-muted hover:text-gold-soft"
                      >
                        {b.name}
                      </Link>
                    </li>
                  ))}
                </ul>
                <Link
                  href={`/perfumes?categoria=${tab}`}
                  onClick={() => setOpen(false)}
                  className="gold-underline mt-5 inline-block text-xs font-medium tracking-wide text-gold hover:text-gold-soft"
                >
                  Ver todos {tab === "arabes" ? "los Árabes" : "de Nicho"} →
                </Link>
              </div>
            </div>
          </>,
          document.body
        )}
    </>
  );
}
