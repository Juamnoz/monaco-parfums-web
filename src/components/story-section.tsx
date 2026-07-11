import Image from "@/components/site-image";
import Link from "next/link";

type StorySectionProps = {
  eyebrow: string;
  title: string;
  body: string;
  ctaLabel: string;
  ctaHref: string;
  image: string;
  imageAlt: string;
  imageSide?: "left" | "right";
};

export function StorySection({
  eyebrow,
  title,
  body,
  ctaLabel,
  ctaHref,
  image,
  imageAlt,
  imageSide = "right",
}: StorySectionProps) {
  return (
    <section className="relative overflow-hidden border-y border-border">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(201,162,77,0.08),_transparent_65%)]" />

      <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-6 py-16 sm:py-20 lg:grid-cols-2 lg:gap-16 lg:px-10">
        <div
          className={`relative aspect-square overflow-hidden rounded-[28px] ${
            imageSide === "right" ? "lg:order-1" : "lg:order-2"
          }`}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(201,162,77,0.14),_transparent_70%)]" />
          <Image
            src={image}
            alt={imageAlt}
            fill
            sizes="(min-width: 1024px) 45vw, 90vw"
            className="object-contain object-center p-10 drop-shadow-[0_30px_40px_rgba(0,0,0,0.5)]"
          />
        </div>

        <div className={imageSide === "right" ? "lg:order-2" : "lg:order-1"}>
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">
            {eyebrow}
          </span>
          <h2 className="font-display mt-3 text-balance text-3xl leading-tight text-foreground sm:text-4xl">
            {title}
          </h2>
          <p className="mt-5 max-w-md text-balance text-sm leading-relaxed text-muted">
            {body}
          </p>
          <Link
            href={ctaHref}
            className="gold-underline mt-6 inline-block text-sm font-medium tracking-wide text-gold hover:text-gold-soft"
          >
            {ctaLabel}
          </Link>
        </div>
      </div>
    </section>
  );
}
