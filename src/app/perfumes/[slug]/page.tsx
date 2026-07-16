import Image from "@/components/site-image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { products } from "@/data/products";
import { formatCOP } from "@/lib/format";
import { AddToCart } from "@/components/add-to-cart";
import { ProductCard } from "@/components/product-card";
import { getSizeOptions } from "@/lib/decants";
import { ViewContentTracker } from "@/components/view-content-tracker";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = products.find((p) => p.slug === slug);
  if (!product) return {};
  return {
    title: `${product.name} — Monaco Parfums`,
    description: `${product.name} de ${product.brand}. ${product.categoryLabel} original — ${formatCOP(product.price)}.`,
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = products.find((p) => p.slug === slug);
  if (!product) notFound();

  const related = products
    .filter((p) => p.category === product.category && p.slug !== product.slug && !p.isTester)
    .slice(0, 4);

  const cheapestOption = getSizeOptions(product.price)[0];

  return (
    <div className="mx-auto max-w-7xl px-6 py-12 lg:px-10">
      <ViewContentTracker
        slug={product.slug}
        name={product.name}
        price={cheapestOption.price}
        brand={product.brand}
      />
      <nav className="mb-8 text-sm text-muted">
        <Link href="/" className="hover:text-gold">Inicio</Link>
        <span className="mx-2">/</span>
        <Link href="/perfumes" className="hover:text-gold">Perfumes</Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="grid gap-12 lg:grid-cols-2">
        <div className="relative aspect-[4/5] overflow-hidden rounded-lg border border-border bg-surface">
          <Image
            src={product.image}
            alt={product.name}
            fill
            priority
            sizes="(min-width: 1024px) 45vw, 90vw"
            className="object-cover"
          />
        </div>

        <div className="flex flex-col">
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">
            {product.categoryLabel} · {product.brand}
          </span>
          <h1 className="font-display mt-3 text-4xl text-foreground">
            {product.name}
          </h1>
          <p className="mt-4 text-2xl font-medium text-gold-soft">
            Desde {formatCOP(cheapestOption.price)}
            <span className="ml-2 text-sm font-normal text-muted">
              ({cheapestOption.ml} ml)
            </span>
          </p>

          <p className="mt-6 max-w-md text-sm leading-relaxed text-muted">
            Fragancia {product.categoryLabel.toLowerCase()} 100% original de{" "}
            {product.brand}. Producto verificado, entrega en Colombia.
          </p>

          <div className="mt-8">
            <AddToCart product={product} />
          </div>

          <dl className="mt-10 space-y-2 border-t border-border pt-6 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted">Marca</dt>
              <dd className="text-foreground">{product.brand}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted">Categoría</dt>
              <dd className="text-foreground">{product.categoryLabel}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted">Disponibilidad</dt>
              <dd className="text-gold-soft">En stock</dd>
            </div>
          </dl>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-24">
          <h2 className="font-display mb-8 text-2xl text-foreground">
            También te puede interesar
          </h2>
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
