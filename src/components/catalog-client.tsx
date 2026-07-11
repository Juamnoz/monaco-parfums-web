"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { products, type Product } from "@/data/products";
import { ProductCard } from "@/components/product-card";
import { primaryBrand } from "@/lib/brands";
import { getSizeOptions } from "@/lib/decants";

const TABS: { key: "todos" | Product["category"]; label: string }[] = [
  { key: "todos", label: "Todos" },
  { key: "arabes", label: "Árabes" },
  { key: "nicho", label: "Nicho" },
];

const PAGE_SIZE = 12;

const PRICE_RANGES: { key: string; label: string; min: number; max: number }[] = [
  { key: "todos", label: "Todos los precios", min: 0, max: Infinity },
  { key: "under22", label: "Hasta $22.000", min: 0, max: 22000 },
  { key: "22to28", label: "$22.000 – $28.000", min: 22001, max: 28000 },
  { key: "over28", label: "Más de $28.000", min: 28001, max: Infinity },
];

export function CatalogClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialCategoria = searchParams.get("categoria");
  const initialMarca = searchParams.get("marca");
  const initialPrecio = searchParams.get("precio");
  const initialQuery = searchParams.get("q") ?? "";

  const [active, setActive] = useState<(typeof TABS)[number]["key"]>(
    initialCategoria === "arabes" || initialCategoria === "nicho"
      ? initialCategoria
      : "todos"
  );
  const [marca, setMarca] = useState<string | null>(initialMarca);
  const [precio, setPrecio] = useState<string>(
    PRICE_RANGES.some((r) => r.key === initialPrecio) ? initialPrecio! : "todos"
  );
  const [query, setQuery] = useState(initialQuery);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  function updateParams(next: Record<string, string | null>) {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(next)) {
      if (value === null) params.delete(key);
      else params.set(key, value);
    }
    router.replace(`/perfumes${params.toString() ? `?${params}` : ""}`, {
      scroll: false,
    });
  }

  function select(key: (typeof TABS)[number]["key"]) {
    setActive(key);
    setMarca(null);
    updateParams({ categoria: key === "todos" ? null : key, marca: null });
  }

  function selectPrecio(key: string) {
    setPrecio(key);
    updateParams({ precio: key === "todos" ? null : key });
  }

  function clearMarca() {
    setMarca(null);
    updateParams({ marca: null });
  }

  const activeRange = PRICE_RANGES.find((r) => r.key === precio) ?? PRICE_RANGES[0];

  const filtered = useMemo(() => {
    return products
      .filter((p) => !p.isTester)
      .filter((p) => active === "todos" || p.category === active)
      .filter((p) => (marca ? primaryBrand(p.brand) === marca : true))
      .filter((p) => {
        const cheapest = getSizeOptions(p.price)[0].price;
        return cheapest >= activeRange.min && cheapest <= activeRange.max;
      })
      .filter((p) =>
        query.trim()
          ? `${p.name} ${p.brand}`.toLowerCase().includes(query.toLowerCase())
          : true
      );
  }, [active, marca, activeRange, query]);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [active, marca, activeRange, query]);

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  return (
    <div>
      <div className="mb-6 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-2">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => select(tab.key)}
              className={`rounded-full border px-5 py-2 text-sm tracking-wide transition-colors ${
                active === tab.key
                  ? "border-gold bg-gold text-background"
                  : "border-border text-muted hover:border-gold/50 hover:text-gold-soft"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <input
          type="text"
          placeholder="Buscar por nombre o marca…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full rounded-full border border-border bg-surface px-5 py-2 text-sm text-foreground placeholder:text-muted focus:border-gold focus:outline-none sm:w-72"
        />
      </div>

      <div className="mb-6 flex flex-wrap items-center gap-2">
        <span className="mr-1 text-[11px] font-semibold uppercase tracking-widest text-muted">
          Precio
        </span>
        {PRICE_RANGES.map((range) => (
          <button
            key={range.key}
            onClick={() => selectPrecio(range.key)}
            className={`rounded-full border px-4 py-1.5 text-xs tracking-wide transition-colors ${
              precio === range.key
                ? "border-gold bg-gold text-background"
                : "border-border text-muted hover:border-gold/50 hover:text-gold-soft"
            }`}
          >
            {range.label}
          </button>
        ))}
      </div>

      {marca && (
        <div className="mb-6 flex items-center gap-2">
          <span className="rounded-full border border-gold/50 bg-surface px-4 py-1.5 text-xs uppercase tracking-wide text-gold-soft">
            Marca: {marca}
          </span>
          <button
            onClick={clearMarca}
            className="text-xs text-muted underline-offset-2 hover:text-gold hover:underline"
          >
            Quitar filtro
          </button>
        </div>
      )}

      <p className="mb-6 text-sm text-muted">
        Mostrando {visible.length} de {filtered.length} fragancia{filtered.length !== 1 ? "s" : ""}
      </p>

      <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
        {visible.map((p) => (
          <div key={p.slug} className="motion-safe:animate-[fadeInUp_0.4s_ease]">
            <ProductCard product={p} />
          </div>
        ))}
      </div>

      {hasMore && (
        <div className="mt-10 flex justify-center">
          <button
            onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
            className="rounded-full border border-gold/50 px-8 py-3 text-sm font-medium tracking-wide text-gold-soft transition-colors hover:border-gold hover:bg-gold hover:text-background"
          >
            Cargar más fragancias
          </button>
        </div>
      )}

      {filtered.length === 0 && (
        <p className="py-20 text-center text-muted">
          No encontramos fragancias con ese criterio.
          {precio !== "todos" && (
            <>
              {" "}
              Prueba con otro rango de precio o{" "}
              <button
                onClick={() => selectPrecio("todos")}
                className="text-gold underline-offset-2 hover:underline"
              >
                quita el filtro
              </button>
              .
            </>
          )}
        </p>
      )}
    </div>
  );
}
