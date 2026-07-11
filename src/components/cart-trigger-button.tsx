"use client";

import { useEffect, useRef, useState } from "react";
import { useCart } from "@/context/cart-context";

export function CartTriggerButton({
  variant = "header",
  compact = false,
}: {
  variant?: "header" | "tabbar";
  compact?: boolean;
}) {
  const { count, openCart } = useCart();
  const [bump, setBump] = useState(false);
  const prevCount = useRef(count);

  useEffect(() => {
    if (count > prevCount.current) {
      setBump(true);
      const t = setTimeout(() => setBump(false), 400);
      prevCount.current = count;
      return () => clearTimeout(t);
    }
    prevCount.current = count;
  }, [count]);

  const icon = (
    <svg
      width={variant === "tabbar" ? 22 : 20}
      height={variant === "tabbar" ? 22 : 20}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className={
        variant === "tabbar"
          ? `transition-transform duration-500 ease-out ${compact ? "scale-[0.86]" : "scale-100"}`
          : ""
      }
    >
      <path d="M6 6h15l-1.5 9h-12L6 6Z" strokeLinejoin="round" />
      <path d="M6 6 5 3H2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="9.5" cy="20" r="1" />
      <circle cx="17.5" cy="20" r="1" />
    </svg>
  );

  const badge = count > 0 && (
    <span
      className={`absolute flex h-5 w-5 items-center justify-center rounded-full bg-gold text-[11px] font-semibold text-background transition-transform ${
        bump ? "scale-125" : "scale-100"
      } ${variant === "tabbar" ? "-right-2 -top-1.5" : "-right-3 -top-2"}`}
    >
      {count}
    </span>
  );

  if (variant === "tabbar") {
    return (
      <button
        type="button"
        onClick={openCart}
        aria-label="Abrir carrito"
        className="relative flex flex-col items-center gap-0.5 px-3 py-1 text-muted transition-colors active:text-gold"
      >
        <span className="relative">
          {icon}
          {badge}
        </span>
        <span
          className={`overflow-hidden text-[10px] tracking-wide transition-all duration-500 ease-out ${
            compact ? "max-h-0 opacity-0" : "max-h-4 opacity-100"
          }`}
        >
          Carrito
        </span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={openCart}
      aria-label="Abrir carrito"
      className="relative flex items-center gap-2 text-sm text-foreground transition-colors hover:text-gold"
    >
      {icon}
      <span className="hidden sm:inline">Carrito</span>
      {badge}
    </button>
  );
}
