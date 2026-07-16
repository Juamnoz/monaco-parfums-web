"use client";

import Image from "@/components/site-image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { usePathname } from "next/navigation";
import { useCart } from "@/context/cart-context";
import { useQuickView } from "@/context/quick-view-context";
import { formatCOP } from "@/lib/format";
import { whatsappOrderUrl } from "@/lib/whatsapp";
import { getCrossSell } from "@/lib/cross-sell";
import { getSizeOptions } from "@/lib/decants";

export function CartDrawer() {
  const { items, count, total, setQty, removeItem, isOpen, closeCart, checkoutUrl, syncing } = useCart();
  const { open: openQuickView } = useQuickView();
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    closeCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") closeCart();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [closeCart]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!mounted) return null;

  const crossSell = getCrossSell(items, 8);

  return createPortal(
    <>
      {/* Overlay */}
      <div
        onClick={closeCart}
        className={`fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* Drawer — bottom sheet on mobile, side panel on desktop */}
      <aside
        className={`fixed inset-x-0 bottom-0 z-[70] flex max-h-[85vh] w-full flex-col rounded-t-[28px] border-t border-border bg-background shadow-[0_-10px_60px_rgba(0,0,0,0.6)] transition-transform duration-300 ease-[cubic-bezier(0.65,0,0.35,1)] sm:inset-x-auto sm:inset-y-0 sm:right-0 sm:top-0 sm:h-full sm:max-h-none sm:w-full sm:max-w-md sm:rounded-none sm:rounded-l-[28px] sm:border-t-0 sm:border-l ${
          isOpen ? "translate-y-0 sm:translate-x-0" : "translate-y-full sm:translate-x-full sm:translate-y-0"
        }`}
      >
        <div className="flex items-center justify-between border-b border-border px-6 py-5">
          <h2 className="font-display flex items-center gap-2 text-xl text-foreground">
            Carrito
            {count > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/10 text-[11px] font-semibold text-muted">
                {count}
              </span>
            )}
          </h2>
          <button
            aria-label="Cerrar carrito"
            onClick={closeCart}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-muted transition-colors hover:border-gold/40 hover:text-gold-soft"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
              <path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div className="px-6 py-10 text-center">
              <p className="text-sm text-muted">Tu carrito está vacío.</p>
              <Link
                href="/perfumes"
                onClick={closeCart}
                className="mt-4 inline-block rounded-full bg-gold px-6 py-2.5 text-xs font-semibold tracking-wide text-background"
              >
                Ver catálogo
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-border px-6">
              {items.map((item) => (
                <li key={`${item.slug}-${item.ml}`} className="flex gap-4 py-5">
                  <Link
                    href={`/perfumes/${item.slug}`}
                    onClick={closeCart}
                    className="relative h-20 w-16 shrink-0 overflow-hidden rounded-xl bg-white/5"
                  >
                    <Image src={item.image} alt={item.name} fill sizes="64px" className="object-contain p-1.5" />
                  </Link>
                  <div className="flex flex-1 flex-col justify-between">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-[10px] uppercase tracking-wide text-muted">
                          {item.brand} · {item.ml} ml
                        </p>
                        <Link
                          href={`/perfumes/${item.slug}`}
                          onClick={closeCart}
                          className="font-display text-sm leading-snug text-foreground hover:text-gold-soft"
                        >
                          {item.name}
                        </Link>
                      </div>
                      <span className="whitespace-nowrap text-sm font-medium text-gold-soft">
                        {formatCOP(item.price * item.qty)}
                      </span>
                    </div>
                    <div className="mt-2 flex items-center gap-3">
                      <div className="flex items-center rounded-full border border-border">
                        <button
                          onClick={() => setQty(item.slug, item.ml, item.qty - 1)}
                          className="px-2.5 py-1 text-muted hover:text-gold"
                        >
                          −
                        </button>
                        <span className="w-6 text-center text-xs">{item.qty}</span>
                        <button
                          onClick={() => setQty(item.slug, item.ml, item.qty + 1)}
                          className="px-2.5 py-1 text-muted hover:text-gold"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.slug, item.ml)}
                        aria-label={`Quitar ${item.name}`}
                        className="flex h-7 w-7 items-center justify-center rounded-full border border-border text-muted transition-colors hover:border-red-400/40 hover:text-red-400"
                      >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                          <path d="M4 7h16M9 7V4h6v3M6 7l1 14h10l1-14" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {/* Cross-sell */}
          {crossSell.length > 0 && (
            <div className="border-t border-border px-6 py-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-gold">
                También te puede gustar
              </p>
              <div className="mt-4 flex gap-3 overflow-x-auto pb-1">
                {crossSell.map((p) => {
                  const cheapest = getSizeOptions(p.price)[0];
                  return (
                    <div key={p.slug} className="w-[110px] shrink-0">
                      <Link
                        href={`/perfumes/${p.slug}`}
                        onClick={closeCart}
                        className="relative block aspect-[4/5] overflow-hidden rounded-xl bg-white/5"
                      >
                        <Image
                          src={p.image}
                          alt={p.name}
                          fill
                          sizes="110px"
                          className="object-contain p-3"
                        />
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            openQuickView(p);
                          }}
                          aria-label={`Vista rápida de ${p.name}`}
                          className="group/eye absolute bottom-1.5 right-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-gold text-background shadow-md transition-transform hover:scale-110"
                        >
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.75"
                            className="motion-safe:group-hover/eye:animate-[eyeBlink_0.5s_ease]"
                          >
                            <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" strokeLinejoin="round" />
                            <circle cx="12" cy="12" r="3" />
                          </svg>
                        </button>
                      </Link>
                      <p className="mt-2 line-clamp-1 text-xs text-foreground">{p.name}</p>
                      <p className="text-xs text-gold-soft">Desde {formatCOP(cheapest.price)}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="space-y-3 border-t border-border px-6 py-5">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted">Total estimado</span>
              <span className="font-display text-lg text-gold-soft">{formatCOP(total)}</span>
            </div>
            <a
              href={checkoutUrl ?? "#"}
              aria-disabled={!checkoutUrl}
              className={`block rounded-full bg-gold px-6 py-3 text-center text-sm font-semibold tracking-wide text-background transition-transform ${
                checkoutUrl ? "hover:scale-[1.01]" : "pointer-events-none opacity-60"
              }`}
            >
              {syncing ? "Actualizando…" : "Finalizar compra"}
            </a>
            <a
              href={whatsappOrderUrl(items, total)}
              target="_blank"
              rel="noreferrer"
              className="block text-center text-xs text-muted underline-offset-2 hover:text-gold hover:underline"
            >
              Prefiero coordinar por WhatsApp
            </a>
            <Link
              href="/carrito"
              onClick={closeCart}
              className="block text-center text-xs text-muted underline-offset-2 hover:text-gold hover:underline"
            >
              Ver carrito completo
            </Link>
          </div>
        )}
      </aside>
    </>,
    document.body
  );
}
