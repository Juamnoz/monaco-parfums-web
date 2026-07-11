// Selección curada para el slider del home. Las notas olfativas quedan
// vacías hasta tener la ficha real de cada fragancia — no se inventan.
export type FragranceNotes = {
  salida?: string;
  corazon?: string;
  fondo?: string;
};

export const FEATURED_SLIDER: Array<{ slug: string; notes?: FragranceNotes }> = [
  { slug: "31-club-de-nuit-bling" },
  { slug: "54-hawas-london" },
  { slug: "07-bahiya-ruby" },
  { slug: "20-hawas-fire" },
  { slug: "32-il-femme" },
  { slug: "33-il-erotique" },
  { slug: "41-il-bordeaux" },
  { slug: "65-hypnotic-gold" },
];
