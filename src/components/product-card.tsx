"use client";

import Image from "@/components/site-image";
import Link from "next/link";
import type { Product } from "@/data/products";
import { formatCOP } from "@/lib/format";
import { getSizeOptions } from "@/lib/decants";
import { useQuickView } from "@/context/quick-view-context";

export function ProductCard({ product }: { product: Product }) {
  const cheapest = getSizeOptions(product.price)[0];
  const { open } = useQuickView();

  function handleQuickView(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    open(product);
  }

  return (
    <Link
      href={`/perfumes/${product.slug}`}
      className="group motion-safe:transition-transform motion-safe:duration-300 motion-safe:hover:-translate-y-1.5"
    >
      <div className="flex flex-col overflow-hidden rounded-[26px] border border-white/10 bg-white/[0.06] shadow-[0_10px_30px_-14px_rgba(0,0,0,0.7),inset_0_1px_0_0_rgba(255,255,255,0.08)] backdrop-blur-xl motion-safe:transition-shadow motion-safe:duration-300 group-hover:border-gold/30 group-hover:shadow-[0_20px_45px_-16px_rgba(0,0,0,0.85),inset_0_1px_0_0_rgba(255,255,255,0.12)]">
        <div className="relative aspect-[4/5] overflow-hidden">
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(min-width: 1024px) 22vw, (min-width: 640px) 45vw, 45vw"
            className="object-contain object-center p-6 motion-safe:transition-transform motion-safe:duration-500 group-hover:scale-[1.06]"
          />
          <span className="absolute left-3 top-3 rounded-full border border-white/15 bg-background/60 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest text-gold-soft backdrop-blur-md">
            {product.categoryLabel}
          </span>

          <button
            onClick={handleQuickView}
            aria-label={`Vista rápida de ${product.name}`}
            className="group/eye absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-gold text-background shadow-[0_6px_16px_-4px_rgba(0,0,0,0.6)] transition-transform duration-300 hover:scale-110"
          >
            <svg
              width="16"
              height="16"
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
        </div>
        <div className="flex flex-1 flex-col gap-1 border-t border-white/10 px-4 pb-4 pt-3">
          <span className="text-[11px] uppercase tracking-wider text-muted">
            {product.brand}
          </span>
          <h3 className="font-display text-base leading-snug text-foreground">
            {product.name}
          </h3>
          <span className="mt-1.5 text-sm font-semibold text-gold-soft">
            Desde {formatCOP(cheapest.price)}
          </span>
        </div>
      </div>
    </Link>
  );
}
