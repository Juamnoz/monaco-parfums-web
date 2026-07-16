"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { products } from "@/data/products";
import { SHOPIFY_VARIANT_MAP } from "@/data/shopify-map";
import { getSizeOptions } from "@/lib/decants";
import {
  cartCreate,
  cartGet,
  cartLinesAdd,
  cartLinesRemove,
  cartLinesUpdate,
  type ShopifyCart,
} from "@/lib/shopify";

export type CartItem = {
  slug: string;
  name: string;
  brand: string;
  price: number;
  image: string;
  ml: number;
  qty: number;
};

type CartContextValue = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "qty">, qty?: number) => void;
  removeItem: (slug: string, ml: number) => void;
  setQty: (slug: string, ml: number, qty: number) => void;
  clear: () => void;
  count: number;
  total: number;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  checkoutUrl: string | null;
  syncing: boolean;
};

const CartContext = createContext<CartContextValue | null>(null);
const CART_ID_KEY = "monaco-parfums-cart-id";

const productBySlug = new Map(products.map((p) => [p.slug, p]));

// variantId -> { slug, ml }, para reconstruir la vista local a partir del carrito real de Shopify
const variantToLocal = new Map<string, { slug: string; ml: number }>();
for (const [slug, entry] of Object.entries(SHOPIFY_VARIANT_MAP)) {
  for (const [ml, variantId] of Object.entries(entry.variants)) {
    variantToLocal.set(variantId, { slug, ml: Number(ml) });
  }
}

function variantIdFor(slug: string, ml: number): string | null {
  return SHOPIFY_VARIANT_MAP[slug]?.variants[String(ml)] ?? null;
}

function lineKey(slug: string, ml: number) {
  return `${slug}:${ml}`;
}

function itemsFromShopifyCart(cart: ShopifyCart): {
  items: CartItem[];
  lineIds: Record<string, string>;
} {
  const items: CartItem[] = [];
  const lineIds: Record<string, string> = {};

  for (const edge of cart.lines.edges) {
    const local = variantToLocal.get(edge.node.merchandise.id);
    if (!local) continue;
    const product = productBySlug.get(local.slug);
    if (!product) continue;
    const option = getSizeOptions(product.price).find((o) => o.ml === local.ml);
    if (!option) continue;

    items.push({
      slug: local.slug,
      name: product.name,
      brand: product.brand,
      price: option.price,
      image: product.image,
      ml: local.ml,
      qty: edge.node.quantity,
    });
    lineIds[lineKey(local.slug, local.ml)] = edge.node.id;
  }

  return { items, lineIds };
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [lineIds, setLineIds] = useState<Record<string, string>>({});
  const [cartId, setCartId] = useState<string | null>(null);
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    const storedId = localStorage.getItem(CART_ID_KEY);
    if (!storedId) return;
    (async () => {
      try {
        const cart = await cartGet(storedId);
        if (!cart) {
          localStorage.removeItem(CART_ID_KEY);
          return;
        }
        const { items: hydrated, lineIds: hydratedLineIds } = itemsFromShopifyCart(cart);
        setItems(hydrated);
        setLineIds(hydratedLineIds);
        setCartId(cart.id);
        setCheckoutUrl(cart.checkoutUrl);
      } catch {
        // si Shopify no responde, seguimos con carrito vacío en vez de romper la página
      }
    })();
  }, []);

  function applyCart(cart: ShopifyCart) {
    const { items: next, lineIds: nextLineIds } = itemsFromShopifyCart(cart);
    setItems(next);
    setLineIds(nextLineIds);
    setCartId(cart.id);
    setCheckoutUrl(cart.checkoutUrl);
    localStorage.setItem(CART_ID_KEY, cart.id);
  }

  async function addItem(item: Omit<CartItem, "qty">, qty = 1) {
    const variantId = variantIdFor(item.slug, item.ml);
    if (!variantId) return;

    setSyncing(true);
    try {
      const cart = cartId
        ? await cartLinesAdd(cartId, variantId, qty)
        : await cartCreate(variantId, qty);
      applyCart(cart);
    } catch {
      // deja el carrito como estaba si Shopify falla; el usuario puede reintentar
    } finally {
      setSyncing(false);
    }
  }

  async function removeItem(slug: string, ml: number) {
    const id = lineIds[lineKey(slug, ml)];
    if (!cartId || !id) return;
    setSyncing(true);
    try {
      const cart = await cartLinesRemove(cartId, id);
      applyCart(cart);
    } catch {
      // no-op
    } finally {
      setSyncing(false);
    }
  }

  async function setQty(slug: string, ml: number, qty: number) {
    if (qty <= 0) return removeItem(slug, ml);
    const id = lineIds[lineKey(slug, ml)];
    if (!cartId || !id) return;
    setSyncing(true);
    try {
      const cart = await cartLinesUpdate(cartId, id, qty);
      applyCart(cart);
    } catch {
      // no-op
    } finally {
      setSyncing(false);
    }
  }

  function clear() {
    setItems([]);
    setLineIds({});
    setCartId(null);
    setCheckoutUrl(null);
    localStorage.removeItem(CART_ID_KEY);
  }

  const { count, total } = useMemo(
    () => ({
      count: items.reduce((sum, i) => sum + i.qty, 0),
      total: items.reduce((sum, i) => sum + i.qty * i.price, 0),
    }),
    [items]
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        setQty,
        clear,
        count,
        total,
        isOpen,
        openCart: () => setIsOpen(true),
        closeCart: () => setIsOpen(false),
        checkoutUrl,
        syncing,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart debe usarse dentro de <CartProvider>");
  return ctx;
}
