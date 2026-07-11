import { products, type Product } from "@/data/products";
import type { CartItem } from "@/context/cart-context";

export function getCrossSell(items: CartItem[], limit = 8): Product[] {
  const inCart = new Set(items.map((i) => i.slug));
  const cartCategories = new Set(
    items
      .map((i) => products.find((p) => p.slug === i.slug)?.category)
      .filter((c): c is Product["category"] => Boolean(c))
  );

  const pool = products.filter((p) => !inCart.has(p.slug) && !p.isTester);

  const prioritized =
    cartCategories.size > 0
      ? [...pool].sort((a, b) => {
          const aMatch = cartCategories.has(a.category) ? 0 : 1;
          const bMatch = cartCategories.has(b.category) ? 0 : 1;
          return aMatch - bMatch;
        })
      : pool;

  return prioritized.slice(0, limit);
}
