"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/cart-context";
import type { Product } from "@/data/products";
import { whatsappProductUrl } from "@/lib/whatsapp";
import { getSizeOptions } from "@/lib/decants";
import { decantsAvailable } from "@/data/decant-availability";
import { formatCOP } from "@/lib/format";

export function AddToCart({ product }: { product: Product }) {
  const { addItem } = useCart();
  const router = useRouter();
  const sizeOptions = useMemo(
    () => getSizeOptions(product.price, decantsAvailable(product.slug)),
    [product.price, product.slug]
  );
  const firstAvailable = sizeOptions.find((s) => s.available) ?? sizeOptions[0];
  const [selectedMl, setSelectedMl] = useState(firstAvailable.ml);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const selected = sizeOptions.find((s) => s.ml === selectedMl) ?? sizeOptions[0];

  function handleAdd() {
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
    setTimeout(() => setAdded(false), 1800);
  }

  function handleBuyNow() {
    handleAdd();
    router.push("/carrito");
  }

  return (
    <div className="space-y-5">
      <div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-muted">
          Tamaño
        </p>
        <div className="flex flex-wrap gap-2">
          {sizeOptions.map((option) => (
            <button
              key={option.ml}
              disabled={!option.available}
              onClick={() => option.available && setSelectedMl(option.ml)}
              className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                !option.available
                  ? "cursor-not-allowed border-border/50 text-muted/40 line-through"
                  : selectedMl === option.ml
                    ? "border-gold bg-gold text-background"
                    : "border-border text-muted hover:border-gold/50 hover:text-gold-soft"
              }`}
            >
              {option.isFullBottle ? "100 ml" : `${option.ml} ml`}
              {!option.available && " · agotado"}
            </button>
          ))}
        </div>
        <p className="mt-3 text-sm text-muted">
          {selected.isFullBottle ? "Frasco original" : "Decant — perfume reenvasado en atomizador"}
          {" · "}
          <span className="font-medium text-gold-soft">{formatCOP(selected.price)}</span>
        </p>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center rounded-full border border-border">
          <button
            aria-label="Restar"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="px-4 py-2 text-lg text-muted hover:text-gold"
          >
            −
          </button>
          <span className="w-8 text-center text-sm">{qty}</span>
          <button
            aria-label="Sumar"
            onClick={() => setQty((q) => q + 1)}
            className="px-4 py-2 text-lg text-muted hover:text-gold"
          >
            +
          </button>
        </div>

        <button
          onClick={handleAdd}
          className="flex-1 rounded-full border border-gold px-6 py-3 text-sm font-semibold tracking-wide text-gold-soft transition-colors hover:bg-gold hover:text-background"
        >
          {added ? "Agregado ✓" : "Agregar al carrito"}
        </button>
      </div>

      <button
        onClick={handleBuyNow}
        className="w-full rounded-full bg-gold px-6 py-3 text-sm font-semibold tracking-wide text-background transition-transform hover:scale-[1.01]"
      >
        Comprar ahora
      </button>

      <a
        href={whatsappProductUrl(product.name)}
        target="_blank"
        rel="noreferrer"
        className="block text-center text-sm text-muted underline-offset-4 hover:text-gold hover:underline"
      >
        Preguntar por WhatsApp
      </a>
    </div>
  );
}
