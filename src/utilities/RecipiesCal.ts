export interface IngredientValue {
  value: number;
  unit: string;
}

/** Matches Google Sheet meat blends for CHORIZO TRADICIONAL. */
export type MeatMix = "85-15" | "90-10" | "80-20";

export const MEAT_MIXES: Record<
  MeatMix,
  { pierna: number; tocino: number; label: string }
> = {
  "85-15": { pierna: 0.7875, tocino: 0.139, label: "85-15" },
  "90-10": { pierna: 0.8339, tocino: 0.0928, label: "90-10" },
  "80-20": { pierna: 0.7412, tocino: 0.1853, label: "80-20" },
};

/** Sheet: 20% molido / 80% picado of Pierna. */
const MOLIDO_RATIO = 0.2;
const PICADO_RATIO = 0.8;

export interface RecipeBatch {
  quantity: number;
  mix: MeatMix;
  baseGrams: number;
  pierna: number;
  tocino: number;
  piernaMolido: number;
  piernaPicado: number;
  spices: Record<string, IngredientValue>;
  polyfosfato: IngredientValue;
  humo: IngredientValue;
  pimienta: IngredientValue;
  tripa: IngredientValue;
  agua: IngredientValue;
  bolsas: IngredientValue;
  manoObra: IngredientValue;
  /** Total mix weight in grams (sheet TOTAL). */
  totalGrams: number;
  yields: { sizeG: number; count: number }[];
}

interface IngredientDetail {
  quantity: number;
  mix?: MeatMix;
}

export const buildRecipeBatch = ({
  quantity,
  mix = "85-15",
}: IngredientDetail): RecipeBatch => {
  const ratios = MEAT_MIXES[mix];
  const baseGrams = 100 * quantity;

  const pierna = baseGrams * ratios.pierna;
  const tocino = baseGrams * ratios.tocino;
  const meat = pierna + tocino;

  const spices: Record<string, IngredientValue> = {
    Comino: { value: baseGrams * 0.0021, unit: "grms" },
    Cilantro: { value: baseGrams * 0.0085, unit: "grms" },
    Cebolla_rama: { value: baseGrams * 0.04, unit: "grms" },
    Sal: { value: baseGrams * 0.0167, unit: "grms" },
    Color: { value: baseGrams * 0.004, unit: "grms" },
    Ajo: { value: baseGrams * 0.02, unit: "grms" },
    Pimentón: { value: baseGrams * 0.02, unit: "grms" },
  };

  const polyfosfato = { value: (meat * 9) / 1000, unit: "grms" };
  const humo = { value: (meat * 2) / 1000, unit: "cc" };
  const pimienta = { value: (meat * 6) / 1000, unit: "grms" };
  const tripa = { value: (quantity * 1.3) / 5, unit: "mts" };
  const agua = { value: meat * 0.1, unit: "grms" };

  const spiceTotal = Object.values(spices).reduce((s, i) => s + i.value, 0);
  const totalGrams =
    meat + spiceTotal + polyfosfato.value + pimienta.value + agua.value;

  // Sheet: bolsas ≈ totalGrams / 500
  const bolsas = { value: totalGrams / 500, unit: "und" };
  // Sheet sample: 0.5 hrs for 25 → 0.02 hrs per unit
  const manoObra = { value: quantity * 0.02, unit: "hrs" };

  return {
    quantity,
    mix,
    baseGrams,
    pierna,
    tocino,
    piernaMolido: pierna * MOLIDO_RATIO,
    piernaPicado: pierna * PICADO_RATIO,
    spices,
    polyfosfato,
    humo,
    pimienta,
    tripa,
    agua,
    bolsas,
    manoObra,
    totalGrams,
    yields: [50, 100, 150, 200].map((sizeG) => ({
      sizeG,
      count: totalGrams / sizeG,
    })),
  };
};

/** Flat list for tipo-specific pepper handling (legacy shape). */
export const ingredientesBase = (
  detail: IngredientDetail
): Record<string, IngredientValue> => {
  const batch = buildRecipeBatch(detail);
  return {
    Pierna: { value: batch.pierna, unit: "grms" },
    Pierna_molido: { value: batch.piernaMolido, unit: "grms" },
    Pierna_picado: { value: batch.piernaPicado, unit: "grms" },
    Tocino: { value: batch.tocino, unit: "grms" },
    ...batch.spices,
    Polyfosfato: batch.polyfosfato,
    Humo_líquido: batch.humo,
    Pimienta_Luis: batch.pimienta,
    Tripa: batch.tripa,
    Agua: batch.agua,
    Bolsas_vacío: batch.bolsas,
    Mano_de_obra: batch.manoObra,
  };
};
