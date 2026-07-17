// Curado a mano (2026-07-17): solo estos productos tienen stock físico confirmado
// para reenvasar en decants (5/10/15ml) — el resto de la colección se vende
// únicamente en frasco completo (100ml) hasta nueva reposición. Espejo del
// inventario puesto en 0 + inventoryPolicy DENY en Shopify para esos mismos
// tamaños (ver shopify-map.ts para los variant IDs).
export const DECANTS_AVAILABLE_SLUGS = new Set<string>([
  "03-yara-elixir",
  "06-nitro-elixir",
  "09-vulcan-feu",
  "11-rome-extradose",
  "12-marshmallow",
  "14-eclaire-banoffi",
  "18-rome-pour-homme",
  "20-hawas-fire",
  "25-lattafa-jasoor",
  "26-rome-pour-femme",
  "27-odyssey-aqua",
  "29-teriaq-intense",
]);

export function decantsAvailable(slug: string): boolean {
  return DECANTS_AVAILABLE_SLUGS.has(slug);
}
