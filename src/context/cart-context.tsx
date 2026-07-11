"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

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
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "monaco-parfums-cart";

function sameLine(item: CartItem, slug: string, ml: number) {
  return item.slug === slug && item.ml === ml;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed: Array<Partial<CartItem> & Omit<CartItem, "ml">> =
          JSON.parse(raw);
        // migración: carritos guardados antes de que existiera "ml"
        setItems(parsed.map((i) => ({ ...i, ml: i.ml ?? 100 })));
      }
    } catch {
      // ignore corrupted local storage
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, hydrated]);

  function addItem(item: Omit<CartItem, "qty">, qty = 1) {
    setItems((prev) => {
      const existing = prev.find((i) => sameLine(i, item.slug, item.ml));
      if (existing) {
        return prev.map((i) =>
          sameLine(i, item.slug, item.ml) ? { ...i, qty: i.qty + qty } : i
        );
      }
      return [...prev, { ...item, qty }];
    });
  }

  function removeItem(slug: string, ml: number) {
    setItems((prev) => prev.filter((i) => !sameLine(i, slug, ml)));
  }

  function setQty(slug: string, ml: number, qty: number) {
    if (qty <= 0) return removeItem(slug, ml);
    setItems((prev) =>
      prev.map((i) => (sameLine(i, slug, ml) ? { ...i, qty } : i))
    );
  }

  function clear() {
    setItems([]);
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
