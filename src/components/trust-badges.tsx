import Image from "@/components/site-image";

const BADGES = [
  {
    label: "100% originales",
    desc: "Producto verificado, nunca imitaciones",
    icon: (
      <path d="M12 3l7 3v6c0 4.5-3 8-7 9-4-1-7-4.5-7-9V6l7-3Z M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
    ),
  },
  {
    label: "Envío a toda Colombia",
    desc: "Recibe tu pedido donde estés",
    icon: (
      <>
        <path d="M3 16V6a1 1 0 0 1 1-1h9v11" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M13 9h4l3 3v4h-7V9Z" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="7" cy="18" r="1.6" />
        <circle cx="17" cy="18" r="1.6" />
      </>
    ),
  },
  {
    label: "Atención por WhatsApp",
    desc: "Resolvemos tus dudas al instante",
    icon: (
      <path d="M4 20l1.4-4.2A7.9 7.9 0 1 1 8.6 19L4 20Z M8.5 10.5c.3 1.8 2.2 3.7 4 4" strokeLinecap="round" strokeLinejoin="round" />
    ),
  },
  {
    label: "Decants desde 5 ml",
    desc: "Prueba antes de llevar el frasco completo",
    icon: (
      <path d="M10 3h4 M11 3v4l-4.5 8A3 3 0 0 0 9.2 20h5.6a3 3 0 0 0 2.7-4.3L13 7V3" strokeLinecap="round" strokeLinejoin="round" />
    ),
  },
];

function BadgeItem({ badge }: { badge: (typeof BADGES)[number] }) {
  return (
    <div className="flex shrink-0 items-center gap-3 px-8">
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        className="shrink-0 text-gold"
      >
        {badge.icon}
      </svg>
      <div className="whitespace-nowrap">
        <p className="text-xs font-semibold uppercase tracking-wide text-foreground">
          {badge.label}
        </p>
        <p className="mt-0.5 text-xs text-muted">{badge.desc}</p>
      </div>
    </div>
  );
}

function LogoDivider() {
  return (
    <div className="flex shrink-0 items-center px-4">
      <Image
        src="/brand/logo.png"
        alt=""
        width={30}
        height={30}
        className="rounded-full opacity-40"
      />
    </div>
  );
}

export function TrustBadges() {
  return (
    <section className="overflow-hidden border-b border-border py-8">
      <div className="group [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
        <div className="flex w-max animate-[marquee_32s_linear_infinite] group-hover:[animation-play-state:paused]">
          {[0, 1].map((copy) => (
            <div key={copy} className="flex items-center">
              {BADGES.map((b) => (
                <div key={`${copy}-${b.label}`} className="flex items-center">
                  <BadgeItem badge={b} />
                  <LogoDivider />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
