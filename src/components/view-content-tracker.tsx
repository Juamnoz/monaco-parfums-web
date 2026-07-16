"use client";

import { useEffect } from "react";
import { pixelViewContent } from "@/lib/pixel";

export function ViewContentTracker(params: {
  slug: string;
  name: string;
  price: number;
  brand: string;
}) {
  useEffect(() => {
    pixelViewContent({
      id: params.slug,
      name: params.name,
      price: params.price,
      brand: params.brand,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.slug]);

  return null;
}
