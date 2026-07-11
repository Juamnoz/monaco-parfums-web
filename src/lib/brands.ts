import { products, type Product } from "@/data/products";

export function primaryBrand(brand: string) {
  return brand.split(/[/(]/)[0].trim();
}

export type BrandGroup = {
  name: string;
  count: number;
  sample: Product;
};

export function getBrandGroups(category: Product["category"]): BrandGroup[] {
  const map = new Map<string, BrandGroup>();

  for (const p of products) {
    if (p.category !== category || p.isTester) continue;
    const name = primaryBrand(p.brand);
    const existing = map.get(name);
    if (existing) {
      existing.count += 1;
    } else {
      map.set(name, { name, count: 1, sample: p });
    }
  }

  return [...map.values()].sort((a, b) => b.count - a.count);
}

export function getProductsByBrand(
  category: Product["category"],
  brandName: string,
  limit = 4
): Product[] {
  return products
    .filter(
      (p) => p.category === category && !p.isTester && primaryBrand(p.brand) === brandName
    )
    .slice(0, limit);
}
