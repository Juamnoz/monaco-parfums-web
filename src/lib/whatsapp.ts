import { WHATSAPP_NUMBER } from "@/lib/config";
import { formatCOP } from "@/lib/format";
import type { CartItem } from "@/context/cart-context";

export function buildOrderMessage(items: CartItem[], total: number) {
  const lines = items.map(
    (i) =>
      `• ${i.qty}x ${i.name} (${i.brand}, ${i.ml} ml) — ${formatCOP(i.price * i.qty)}`
  );
  return [
    "Hola, quiero hacer este pedido en Monaco Parfums:",
    "",
    ...lines,
    "",
    `Total: ${formatCOP(total)}`,
  ].join("\n");
}

export function whatsappOrderUrl(items: CartItem[], total: number) {
  const text = encodeURIComponent(buildOrderMessage(items, total));
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
}

export function whatsappProductUrl(name: string) {
  const text = encodeURIComponent(
    `Hola, me interesa el perfume "${name}" de Monaco Parfums.`
  );
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
}
