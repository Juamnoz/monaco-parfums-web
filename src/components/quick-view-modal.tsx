"use client";

import Image from "@/components/site-image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { useQuickView } from "@/context/quick-view-context";
import { useCart } from "@/context/cart-context";
import { getSizeOptions } from "@/lib/decants";
import { decantsAvailable } from "@/data/decant-availability";
import { formatCOP } from "@/lib/format";
import { pixelViewContent } from "@/lib/pixel";

export function QuickViewModal() {
  const { product, close } = useQuickView();
  const { addItem } = useCart();
  const [mounted, setMounted] = useState(false);
  const [qty, setQty] = useState(1);
  const [selectedMl, setSelectedMl] = useState<number | null>(null);
  const [added, setAdded] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (product) {
      setQty(1);
      setSelectedMl(null);
      setAdded(false);
      pixelViewContent({
        id: product.slug,
        name: product.name,
        price: product.price,
        brand: product.brand,
      });
    }
  }, [product]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") close();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [close]);

  useEffect(() => {
    document.body.style.overflow = product ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [product]);

  const sizeOptions = useMemo(
    () => (product ? getSizeOptions(product.price, decantsAvailable(product.slug)) : []),
    [product]
  );
  const selected =
    sizeOptions.find((s) => s.ml === selectedMl) ??
    sizeOptions.find((s) => s.available) ??
    sizeOptions[0];

  if (!mounted) return null;

  return createPortal(
    <div
      className={`fixed inset-0 z-[80] flex items-end justify-center transition-opacity duration-300 sm:items-center ${
        product ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      <div onClick={close} className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {product && selected && (
        <div
          className={`relative w-full max-w-lg overflow-hidden rounded-t-[28px] border border-white/10 bg-background shadow-[0_-10px_60px_rgba(0,0,0,0.6)] transition-transform duration-300 ease-[cubic-bezier(0.65,0,0.35,1)] sm:rounded-[28px] sm:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.7)] ${
            product ? "translate-y-0" : "translate-y-8"
          }`}
        >
          <button
            aria-label="Cerrar"
            onClick={close}
            className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-background/70 text-muted backdrop-blur-md transition-colors hover:border-gold/40 hover:text-gold-soft"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
              <path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" />
            </svg>
          </button>

          <div className="grid gap-6 p-6 sm:grid-cols-2 sm:p-8">
            <div className="relative aspect-square overflow-hidden rounded-2xl bg-white/5">
              <Image
                src={product.image}
                alt={product.name}
                fill
                sizes="(min-width: 640px) 45vw, 90vw"
                className="object-contain object-center p-8"
              />
            </div>

            <div className="flex flex-col">
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-gold">
                {product.categoryLabel} · {product.brand}
              </span>
              <h2 className="font-display mt-2 text-2xl text-foreground">{product.name}</h2>

              <div className="mt-5">
                <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-widest text-muted">
                  Tamaño
                </p>
                <div className="flex flex-wrap gap-2">
                  {sizeOptions.map((option) => (
                    <button
                      key={option.ml}
                      disabled={!option.available}
                      onClick={() => option.available && setSelectedMl(option.ml)}
                      className={`rounded-full border px-3.5 py-1.5 text-sm transition-colors ${
                        !option.available
                          ? "cursor-not-allowed border-border/50 text-muted/40 line-through"
                          : selected.ml === option.ml
                            ? "border-gold bg-gold text-background"
                            : "border-border text-muted hover:border-gold/50 hover:text-gold-soft"
                      }`}
                    >
                      {option.isFullBottle ? "100 ml" : `${option.ml} ml`}
                      {!option.available && " · agotado"}
                    </button>
                  ))}
                </div>
                <p className="mt-2.5 text-lg font-semibold text-gold-soft">
                  {formatCOP(selected.price)}
                </p>
              </div>

              <div className="mt-5 flex items-center gap-3">
                <div className="flex items-center rounded-full border border-border">
                  <button
                    aria-label="Restar"
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="px-3.5 py-1.5 text-muted hover:text-gold"
                  >
                    −
                  </button>
                  <span className="w-7 text-center text-sm">{qty}</span>
                  <button
                    aria-label="Sumar"
                    onClick={() => setQty((q) => q + 1)}
                    className="px-3.5 py-1.5 text-muted hover:text-gold"
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                onClick={() => {
                  addItem(
                    {
                      slug: product.slug,
                      name: product.name,
                      brand: product.brand,
                      price: selected.price,
                      image: product.image,
                      ml: selected.ml,
                    },
                    qty
                  );
                  setAdded(true);
                  setTimeout(() => close(), 700);
                }}
                className="mt-6 rounded-full bg-gold px-6 py-3 text-sm font-semibold tracking-wide text-background transition-transform hover:scale-[1.01]"
              >
                {added ? "Agregado ✓" : "Agregar al carrito"}
              </button>

              <Link
                href={`/perfumes/${product.slug}`}
                onClick={close}
                className="mt-3 text-center text-xs text-muted underline-offset-2 hover:text-gold hover:underline"
              >
                Ver ficha completa →
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>,
    document.body
  );
}
