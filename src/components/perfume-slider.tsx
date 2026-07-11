"use client";

import Image from "@/components/site-image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { products, type Product } from "@/data/products";
import { FEATURED_SLIDER, type FragranceNotes } from "@/data/featured-slider";
import { formatCOP } from "@/lib/format";
import { getSizeOptions } from "@/lib/decants";

type Slide = { product: Product; notes?: FragranceNotes };

const slides: Slide[] = FEATURED_SLIDER.flatMap(({ slug, notes }) => {
  const product = products.find((p) => p.slug === slug);
  return product ? [{ product, notes }] : [];
});

const AUTOPLAY_MS = 4500;

export function PerfumeSlider() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const goTo = useCallback((i: number) => {
    setIndex(((i % slides.length) + slides.length) % slides.length);
  }, []);

  useEffect(() => {
    if (paused) return;
    timerRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, AUTOPLAY_MS);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [paused]);

  if (slides.length === 0) return null;

  const active = slides[index];
  const cheapest = getSizeOptions(active.product.price)[0];
  const { notes } = active;
  const hasNotes = notes && (notes.salida || notes.corazon || notes.fondo);

  return (
    <section
      className="relative overflow-hidden border-y border-border py-16 sm:py-20"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(201,162,77,0.1),_transparent_65%)]" />

      <div className="relative mx-auto max-w-3xl px-6">
        <div className="text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.35em] text-gold">
            Colección destacada
          </span>
        </div>

        {/* Track */}
        <div className="relative mt-8 overflow-hidden">
          <div
            className="flex transition-transform duration-700 ease-[cubic-bezier(0.65,0,0.35,1)]"
            style={{ transform: `translateX(-${index * 100}%)` }}
          >
            {slides.map(({ product }) => (
              <div key={product.slug} className="relative aspect-square w-full shrink-0 sm:aspect-[16/10]">
                <div className="absolute bottom-6 left-1/2 h-8 w-40 -translate-x-1/2 rounded-full bg-gold/15 blur-2xl sm:bottom-10 sm:w-56" />
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  sizes="(min-width: 640px) 620px, 90vw"
                  className="object-contain object-center p-12 drop-shadow-[0_25px_35px_rgba(0,0,0,0.55)] sm:p-16"
                  priority={product.slug === slides[0].product.slug}
                />
              </div>
            ))}
          </div>

          {/* Arrows */}
          <button
            aria-label="Anterior"
            onClick={() => goTo(index - 1)}
            className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-background/50 text-foreground backdrop-blur-md transition-colors hover:border-gold/40 hover:text-gold-soft"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
              <path d="m15 6-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            aria-label="Siguiente"
            onClick={() => goTo(index + 1)}
            className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-background/50 text-foreground backdrop-blur-md transition-colors hover:border-gold/40 hover:text-gold-soft"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
              <path d="m9 6 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        {/* Info below — re-keyed per slide so it fades in on change */}
        <div key={active.product.slug} className="mt-8 animate-[fadeInUp_0.5s_ease] text-center">
          <span className="text-[11px] uppercase tracking-[0.25em] text-muted">
            {active.product.categoryLabel} · {active.product.brand}
          </span>
          <Link
            href={`/perfumes/${active.product.slug}`}
            className="font-display mt-2 block text-3xl text-foreground transition-colors hover:text-gold-soft sm:text-4xl"
          >
            {active.product.name}
          </Link>
          <p className="mt-2 text-lg font-medium text-gold-soft">
            {formatCOP(active.product.price)}
            <span className="ml-1 text-sm font-normal text-muted">(100 ml)</span>
          </p>
          <p className="mt-0.5 text-xs text-muted">
            Decants desde {formatCOP(cheapest.price)}
          </p>

          {hasNotes ? (
            <dl className="mx-auto mt-6 grid max-w-lg grid-cols-3 gap-4 border-t border-border pt-6 text-left">
              {notes?.salida && (
                <div>
                  <dt className="text-[10px] uppercase tracking-widest text-gold">Salida</dt>
                  <dd className="mt-1 text-xs text-muted">{notes.salida}</dd>
                </div>
              )}
              {notes?.corazon && (
                <div>
                  <dt className="text-[10px] uppercase tracking-widest text-gold">Corazón</dt>
                  <dd className="mt-1 text-xs text-muted">{notes.corazon}</dd>
                </div>
              )}
              {notes?.fondo && (
                <div>
                  <dt className="text-[10px] uppercase tracking-widest text-gold">Fondo</dt>
                  <dd className="mt-1 text-xs text-muted">{notes.fondo}</dd>
                </div>
              )}
            </dl>
          ) : null}
        </div>

        {/* Dots */}
        <div className="mt-8 flex items-center justify-center gap-2">
          {slides.map((s, i) => (
            <button
              key={s.product.slug}
              aria-label={`Ir a ${s.product.name}`}
              onClick={() => goTo(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === index ? "w-6 bg-gold" : "w-1.5 bg-white/20 hover:bg-white/40"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
