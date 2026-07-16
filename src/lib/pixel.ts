export const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID ?? "";

type Fbq = (...args: unknown[]) => void;

declare global {
  interface Window {
    fbq?: Fbq;
  }
}

function fbq(...args: unknown[]) {
  if (typeof window === "undefined" || !window.fbq) return;
  window.fbq(...args);
}

export function pixelPageView() {
  fbq("track", "PageView");
}

export function pixelViewContent(params: {
  id: string;
  name: string;
  price: number;
  brand: string;
}) {
  fbq("track", "ViewContent", {
    content_ids: [params.id],
    content_name: params.name,
    content_type: "product",
    content_category: params.brand,
    value: params.price,
    currency: "COP",
  });
}

export function pixelAddToCart(params: {
  id: string;
  name: string;
  price: number;
  quantity: number;
}) {
  fbq("track", "AddToCart", {
    content_ids: [params.id],
    content_name: params.name,
    content_type: "product",
    value: params.price * params.quantity,
    currency: "COP",
  });
}

export function pixelInitiateCheckout(params: {
  ids: string[];
  numItems: number;
  value: number;
}) {
  fbq("track", "InitiateCheckout", {
    content_ids: params.ids,
    content_type: "product",
    num_items: params.numItems,
    value: params.value,
    currency: "COP",
  });
}
