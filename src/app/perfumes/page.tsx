import { Suspense } from "react";
import { CatalogClient } from "@/components/catalog-client";

export const metadata = {
  title: "Catálogo — Monaco Parfums",
};

export default function PerfumesPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-14 lg:px-10">
      <div className="mb-10">
        <span className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">
          Catálogo
        </span>
        <h1 className="font-display mt-3 text-4xl text-foreground">
          Nuestras fragancias
        </h1>
      </div>
      <Suspense fallback={null}>
        <CatalogClient />
      </Suspense>
    </div>
  );
}
