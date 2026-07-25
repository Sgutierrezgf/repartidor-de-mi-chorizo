import { buildRecipeBatch, type MeatMix, type RecipeBatch } from "./RecipiesCal";

export type ProductType = "normal" | "picante" | "pimienta";

export const getRecipePorTipo = (
  type: ProductType,
  quantity: number,
  mix: MeatMix = "85-15"
): RecipeBatch & { pepperLabel: string | null; pepperValue: number } => {
  const batch = buildRecipeBatch({ quantity, mix });

  if (type === "normal") {
    return {
      ...batch,
      pimienta: { value: 0, unit: "grms" },
      pepperLabel: null,
      pepperValue: 0,
      // Recalculate total without pepper
      totalGrams: batch.totalGrams - batch.pimienta.value,
      yields: [50, 100, 150, 200].map((sizeG) => ({
        sizeG,
        count: (batch.totalGrams - batch.pimienta.value) / sizeG,
      })),
      bolsas: {
        value: (batch.totalGrams - batch.pimienta.value) / 500,
        unit: "und",
      },
    };
  }

  if (type === "picante") {
    return {
      ...batch,
      pepperLabel: "Pimienta_roja",
      pepperValue: batch.pimienta.value,
    };
  }

  return {
    ...batch,
    pepperLabel: "Pimienta_Luis",
    pepperValue: batch.pimienta.value,
  };
};

/** @deprecated Prefer getRecipePorTipo */
export const getIngredientesPorTipo = (
  type: ProductType,
  quantity: number,
  mix: MeatMix = "85-15"
) => {
  const batch = getRecipePorTipo(type, quantity, mix);
  const list: Record<string, { value: number; unit: string }> = {
    Pierna: { value: batch.pierna, unit: "grms" },
    Pierna_molido: { value: batch.piernaMolido, unit: "grms" },
    Pierna_picado: { value: batch.piernaPicado, unit: "grms" },
    Tocino: { value: batch.tocino, unit: "grms" },
    ...batch.spices,
    Polyfosfato: batch.polyfosfato,
    Humo_líquido: batch.humo,
    Tripa: batch.tripa,
    Agua: batch.agua,
    Bolsas_vacío: batch.bolsas,
    Mano_de_obra: batch.manoObra,
  };

  if (batch.pepperLabel && batch.pepperValue > 0) {
    list[batch.pepperLabel] = { value: batch.pepperValue, unit: "grms" };
  }

  return list;
};
