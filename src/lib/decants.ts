// Precios de decants calculados a partir del precio de frasco completo (asumido 100 ml).
// Multiplicador más alto en tamaños chicos porque el costo de envase/mano de obra
// se reparte entre menos ml.
const DECANT_MULTIPLIER: Record<number, number> = {
  5: 1.8,
  10: 1.55,
  15: 1.35,
};

export const DECANT_SIZES = [5, 10, 15] as const;
export type DecantSize = (typeof DECANT_SIZES)[number];
export const FULL_BOTTLE_ML = 100;

export type SizeOption = {
  ml: number;
  label: string;
  price: number;
  isFullBottle: boolean;
};

export function decantPrice(fullPrice: number, ml: DecantSize): number {
  const perMl = fullPrice / FULL_BOTTLE_ML;
  const raw = perMl * ml * DECANT_MULTIPLIER[ml];
  return Math.round(raw / 1000) * 1000;
}

export function getSizeOptions(fullPrice: number): SizeOption[] {
  return [
    ...DECANT_SIZES.map((ml) => ({
      ml,
      label: `${ml} ml`,
      price: decantPrice(fullPrice, ml),
      isFullBottle: false,
    })),
    {
      ml: FULL_BOTTLE_ML,
      label: `${FULL_BOTTLE_ML} ml (frasco original)`,
      price: fullPrice,
      isFullBottle: true,
    },
  ];
}
