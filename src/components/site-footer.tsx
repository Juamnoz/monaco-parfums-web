import Link from "next/link";
import { SITE, WHATSAPP_NUMBER } from "@/lib/config";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 lg:grid-cols-3 lg:px-10">
        <div>
          <h3 className="font-display text-xl text-foreground">Monaco Parfums</h3>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted">
            {SITE.tagline} Perfumería árabe y de nicho, originales, en Colombia.
          </p>
        </div>

        <div>
          <h4 className="text-xs font-semibold tracking-[0.2em] text-gold uppercase">
            Explorar
          </h4>
          <ul className="mt-4 space-y-2 text-sm text-muted">
            <li><Link href="/perfumes?categoria=arabes" className="hover:text-gold">Perfumes Árabes</Link></li>
            <li><Link href="/perfumes?categoria=nicho" className="hover:text-gold">Perfumes de Nicho</Link></li>
            <li><Link href="/perfumes" className="hover:text-gold">Todo el catálogo</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-semibold tracking-[0.2em] text-gold uppercase">
            Contacto
          </h4>
          <ul className="mt-4 space-y-2 text-sm text-muted">
            <li>
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noreferrer"
                className="hover:text-gold"
              >
                WhatsApp
              </a>
            </li>
            <li>
              <a href={SITE.instagram} target="_blank" rel="noreferrer" className="hover:text-gold">
                Instagram
              </a>
            </li>
            <li>{SITE.city}</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border px-6 py-6 text-center text-xs text-muted lg:px-10">
        © {new Date().getFullYear()} Monaco Parfums. Todos los derechos reservados.
      </div>
    </footer>
  );
}
