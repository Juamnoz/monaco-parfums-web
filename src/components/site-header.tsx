"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { MegaMenu } from "@/components/mega-menu";
import { CartTriggerButton } from "@/components/cart-trigger-button";

export function SiteHeader() {
  const [visible, setVisible] = useState(true);
  const lastY = useRef(0);

  useEffect(() => {
    lastY.current = window.scrollY;
    function onScroll() {
      const y = window.scrollY;
      if (y > lastY.current && y > 80) setVisible(false);
      else if (y < lastY.current) setVisible(true);
      lastY.current = y;
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 border-b border-border/80 bg-background/90 backdrop-blur transition-transform duration-500 ease-out ${
        visible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-center px-6 py-4 md:justify-between lg:px-10">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/brand/logo.png"
            alt="Monaco Parfums"
            width={40}
            height={40}
            className="rounded-full"
            priority
          />
          <span className="font-display text-lg tracking-wide text-foreground">
            Monaco Parfums
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <Link href="/" className="text-sm tracking-wide text-muted transition-colors hover:text-gold">
            Inicio
          </Link>
          <MegaMenu />
          <Link
            href="/perfumes"
            className="text-sm tracking-wide text-muted transition-colors hover:text-gold"
          >
            Todos
          </Link>
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          <CartTriggerButton />
        </div>
      </div>
    </header>
  );
}
