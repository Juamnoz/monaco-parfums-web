"use client";

import Image from "@/components/site-image";
import Link from "next/link";
import { useCart } from "@/context/cart-context";
import { formatCOP } from "@/lib/format";
import { whatsappOrderUrl } from "@/lib/whatsapp";

export default function CarritoPage() {
  const { items, setQty, removeItem, total, clear, checkoutUrl, syncing, trackCheckoutStart } = useCart();

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-24 text-center lg:px-10">
        <h1 className="font-display text-3xl text-foreground">Tu carrito está vacío</h1>
        <p className="mt-3 text-muted">Explora nuestra colección y encuentra tu próxima fragancia.</p>
        <Link
          href="/perfumes"
          className="mt-8 inline-block rounded-full bg-gold px-8 py-3 text-sm font-semibold text-background"
        >
          Ver catálogo
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-14 lg:px-10">
      <h1 className="font-display mb-10 text-3xl text-foreground">Tu carrito</h1>

      <ul className="divide-y divide-border border-y border-border">
        {items.map((item) => (
          <li key={`${item.slug}-${item.ml}`} className="flex gap-4 py-5">
            <div className="relative h-24 w-20 shrink-0 overflow-hidden rounded border border-border bg-surface">
              <Image src={item.image} alt={item.name} fill className="object-cover" />
            </div>
            <div className="flex flex-1 flex-col justify-between">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted">{item.brand} · {item.ml} ml</p>
                  <Link href={`/perfumes/${item.slug}`} className="font-display text-lg text-foreground hover:text-gold-soft">
                    {item.name}
                  </Link>
                </div>
                <button
                  onClick={() => removeItem(item.slug, item.ml)}
                  className="text-xs text-muted hover:text-red-400"
                >
                  Quitar
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center rounded-full border border-border">
                  <button
                    onClick={() => setQty(item.slug, item.ml, item.qty - 1)}
                    className="px-3 py-1 text-muted hover:text-gold"
                  >
                    −
                  </button>
                  <span className="w-6 text-center text-sm">{item.qty}</span>
                  <button
                    onClick={() => setQty(item.slug, item.ml, item.qty + 1)}
                    className="px-3 py-1 text-muted hover:text-gold"
                  >
                    +
                  </button>
                </div>
                <span className="text-sm font-medium text-gold-soft">
                  {formatCOP(item.price * item.qty)}
                </span>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-8 flex flex-col items-end gap-4">
        <div className="flex w-full max-w-xs justify-between text-lg">
          <span className="text-muted">Total</span>
          <span className="font-display text-gold-soft">{formatCOP(total)}</span>
        </div>

        <a
          href={checkoutUrl ?? "#"}
          aria-disabled={!checkoutUrl}
          onClick={trackCheckoutStart}
          className={`w-full max-w-xs rounded-full bg-gold px-8 py-3 text-center text-sm font-semibold tracking-wide text-background transition-transform ${
            checkoutUrl ? "hover:scale-[1.02]" : "pointer-events-none opacity-60"
          }`}
        >
          {syncing ? "Actualizando…" : "Finalizar compra"}
        </a>

        <a
          href={whatsappOrderUrl(items, total)}
          target="_blank"
          rel="noreferrer"
          className="text-xs text-muted underline-offset-2 hover:text-gold hover:underline"
        >
          Prefiero coordinar por WhatsApp
        </a>

        <button onClick={clear} className="text-xs text-muted hover:text-red-400">
          Vaciar carrito
        </button>
      </div>
    </div>
  );
}
