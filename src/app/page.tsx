import Image from "next/image";
import Link from "next/link";
import { products } from "@/data/products";
import { ProductCard } from "@/components/product-card";
import { PerfumeSlider } from "@/components/perfume-slider";
import { TrustBadges } from "@/components/trust-badges";
import { StorySection } from "@/components/story-section";

export default function Home() {
  const arabes = products.filter((p) => p.category === "arabes" && !p.isTester).slice(0, 8);
  const nicho = products.filter((p) => p.category === "nicho").slice(0, 4);

  return (
    <div>
      {/* Hero */}
      <section className="relative flex min-h-[88vh] items-end overflow-hidden border-b border-border">
        <video
          src="/video/hero.mp4"
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 h-full w-full object-cover object-center opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/10" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(201,162,77,0.12),_transparent_60%)]" />

        <div className="relative mx-auto w-full max-w-7xl px-6 pb-20 lg:px-10">
          <span className="text-xs font-semibold uppercase tracking-[0.35em] text-gold">
            Perfumería original
          </span>
          <h1 className="font-display mt-4 max-w-2xl text-balance text-5xl leading-[1.1] text-foreground sm:text-6xl lg:text-7xl">
            El lujo de
            <br />
            <span className="text-gold-soft">oler diferente.</span>
          </h1>
          <p className="mt-6 max-w-md text-balance text-base leading-relaxed text-muted">
            Perfumería árabe y de nicho, cuidadosamente seleccionada. Fragancias
            originales de las casas más reconocidas de Medio Oriente y la línea
            de nicho ILMIN Parfums.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-6">
            <Link
              href="/perfumes"
              className="rounded-full bg-gold px-8 py-3 text-sm font-semibold tracking-wide text-background transition-transform hover:scale-[1.03]"
            >
              Descubrir colección
            </Link>
            <Link
              href="/perfumes?categoria=nicho"
              className="gold-underline text-sm tracking-wide text-foreground hover:text-gold-soft"
            >
              Ver perfumes de nicho
            </Link>
          </div>
        </div>
      </section>

      <TrustBadges />

      <PerfumeSlider />

      {/* Category strip */}
      <section className="mx-auto grid max-w-7xl grid-cols-2 gap-3 px-6 py-16 sm:gap-4 lg:px-10">
        <Link
          href="/perfumes?categoria=arabes"
          className="group relative flex h-52 items-end overflow-hidden rounded-[28px] border border-border bg-surface p-4 sm:h-64 sm:rounded-3xl sm:p-8"
        >
          <Image
            src="/category/arabes.png"
            alt=""
            fill
            sizes="(min-width: 640px) 45vw, 50vw"
            className="object-cover object-center opacity-60 transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(201,162,77,0.16),_transparent_55%)] transition-opacity group-hover:opacity-80" />
          <div className="relative">
            <span className="text-[10px] uppercase tracking-[0.25em] text-gold sm:text-xs sm:tracking-[0.3em]">56 fragancias</span>
            <h3 className="font-display mt-1.5 text-xl leading-tight text-foreground sm:mt-2 sm:text-3xl">Perfumes Árabes</h3>
            <p className="mt-1 text-xs text-muted sm:mt-2 sm:text-sm">$180.000 – $300.000</p>
          </div>
        </Link>
        <Link
          href="/perfumes?categoria=nicho"
          className="group relative flex h-52 items-end overflow-hidden rounded-[28px] border border-border bg-surface p-4 sm:h-64 sm:rounded-3xl sm:p-8"
        >
          <Image
            src="/category/nicho.png"
            alt=""
            fill
            sizes="(min-width: 640px) 45vw, 50vw"
            className="object-cover object-center opacity-60 transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(201,162,77,0.16),_transparent_55%)] transition-opacity group-hover:opacity-80" />
          <div className="relative">
            <span className="text-[10px] uppercase tracking-[0.25em] text-gold sm:text-xs sm:tracking-[0.3em]">ILMIN Parfums</span>
            <h3 className="font-display mt-1.5 text-xl leading-tight text-foreground sm:mt-2 sm:text-3xl">Perfumes de Nicho</h3>
            <p className="mt-1 text-xs text-muted sm:mt-2 sm:text-sm">Perfumería de autor</p>
          </div>
        </Link>
      </section>

      <StorySection
        eyebrow="Perfumes Árabes"
        title="El arte de Oriente, embotellado."
        body="Una selección curada de las casas de perfumería árabe y emiratí más reconocidas — Lattafa, Armaf, Rasasi, Afnan y más. Fragancias intensas, originales y de larga duración."
        ctaLabel="Explorar Árabes →"
        ctaHref="/perfumes?categoria=arabes"
        image="/products/31-club-de-nuit-bling.png"
        imageAlt="Club de Nuit Bling, Armaf"
        imageSide="right"
      />

      {/* Featured — Árabes */}
      <section className="mx-auto max-w-7xl px-6 py-10 lg:px-10">
        <div className="mb-8 flex items-end justify-between">
          <h2 className="font-display text-2xl text-foreground sm:text-3xl">
            Perfumes Árabes
          </h2>
          <Link href="/perfumes?categoria=arabes" className="text-sm text-gold hover:text-gold-soft">
            Ver todos →
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          {arabes.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </section>

      <StorySection
        eyebrow="Perfumes de Nicho"
        title="Perfumería de autor."
        body="ILMIN Parfums se aleja del circuito de las casas árabes: composiciones exclusivas, fuera de lo masivo, para quienes buscan una fragancia que no se repite en cada esquina."
        ctaLabel="Descubrir ILMIN →"
        ctaHref="/perfumes?categoria=nicho"
        image="/products/32-il-femme.png"
        imageAlt="IL Femme, ILMIN Parfums"
        imageSide="left"
      />

      {/* Featured — Nicho */}
      <section className="mx-auto max-w-7xl px-6 py-10 pb-24 lg:px-10">
        <div className="mb-8 flex items-end justify-between">
          <h2 className="font-display text-2xl text-foreground sm:text-3xl">
            Perfumes de Nicho — ILMIN
          </h2>
          <Link href="/perfumes?categoria=nicho" className="text-sm text-gold hover:text-gold-soft">
            Ver todos →
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          {nicho.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </section>
    </div>
  );
}
