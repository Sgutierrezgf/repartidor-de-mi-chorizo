import {
  getIngredientesPorTipo,
  type ProductType,
} from "./ingredientesPorTipo";
import type { MeatMix } from "./RecipiesCal";
import type { IngredientValue } from "./RecipiesCal";

export const RECIPE_TYPES: ProductType[] = ["normal", "pimienta", "picante"];

/** Stable row order for the production matrix. */
export const INGREDIENT_ROW_KEYS = [
  "Pierna",
  "Pierna_molido",
  "Pierna_picado",
  "Tocino",
  "Comino",
  "Cilantro",
  "Cebolla_rama",
  "Sal",
  "Color",
  "Ajo",
  "Pimentón",
  "Polyfosfato",
  "Humo_líquido",
  "Pimienta_Luis",
  "Pimienta_roja",
  "Tripa",
  "Agua",
  "Bolsas_vacío",
  "Mano_de_obra",
] as const;

export type IngredientRowKey = (typeof INGREDIENT_ROW_KEYS)[number];

export type QtyByType = Record<ProductType, number>;

export interface MatrixCell {
  value: number;
  unit: string;
}

export interface MatrixRow {
  key: IngredientRowKey;
  byType: Record<ProductType, MatrixCell | null>;
  total: MatrixCell | null;
}

const emptyCell = (unit: string): MatrixCell => ({ value: 0, unit });

export const buildRecipeMatrix = (
  quantities: QtyByType,
  mix: MeatMix
): { rows: MatrixRow[]; activeTypes: ProductType[]; anyActive: boolean } => {
  const lists: Partial<Record<ProductType, Record<string, IngredientValue>>> =
    {};
  const activeTypes: ProductType[] = [];

  for (const type of RECIPE_TYPES) {
    const qty = quantities[type];
    if (qty > 0) {
      activeTypes.push(type);
      lists[type] = getIngredientesPorTipo(type, qty, mix);
    }
  }

  const rows: MatrixRow[] = INGREDIENT_ROW_KEYS.map((key) => {
    const byType = {} as Record<ProductType, MatrixCell | null>;
    let unit = "grms";
    let totalValue = 0;
    let any = false;

    for (const type of RECIPE_TYPES) {
      const list = lists[type];
      const item = list?.[key];
      if (item && item.value > 0) {
        byType[type] = { value: item.value, unit: item.unit };
        unit = item.unit;
        totalValue += item.value;
        any = true;
      } else {
        byType[type] = list ? emptyCell(item?.unit ?? unit) : null;
      }
    }

    // If no type has this ingredient at all, still show row with zeros for active types
    const hasAnyList = activeTypes.length > 0;
    if (!any && hasAnyList) {
      // Keep pepper rows only if at least one type uses them
      if (key === "Pimienta_Luis" || key === "Pimienta_roja") {
        const used = activeTypes.some((t) => (lists[t]?.[key]?.value ?? 0) > 0);
        if (!used) {
          return {
            key,
            byType,
            total: null,
          };
        }
      }
    }

    return {
      key,
      byType,
      total: any ? { value: totalValue, unit } : hasAnyList ? emptyCell(unit) : null,
    };
  }).filter((row) => {
    if (activeTypes.length === 0) return false;
    // Hide pepper rows that are entirely unused
    if (row.key === "Pimienta_Luis" || row.key === "Pimienta_roja") {
      return RECIPE_TYPES.some((t) => (row.byType[t]?.value ?? 0) > 0);
    }
    return true;
  });

  return {
    rows,
    activeTypes,
    anyActive: activeTypes.length > 0,
  };
};
