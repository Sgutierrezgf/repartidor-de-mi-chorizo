import { ingredientesBase } from "./RecipiesCal";


export type ProductType = "normal" | "picante" | "pimienta";

export const getIngredientesPorTipo = (
  type: ProductType,
  quantity: number
) => {
  const base = ingredientesBase({ quantity });

  // Sacamos la pimienta original para decidir qué hacer
  const { Pimienta_Luis, ...rest } = base;

  if (type === "normal") {
    // ❌ Los normales NO llevan pimienta
    return rest;
  }

  if (type === "picante") {
    // 🔥 Se usa Pimienta Rojo en vez de Pimienta Luis
    return {
      ...rest,
      Pimienta_roja: {
        value: Pimienta_Luis.value,
        unit: Pimienta_Luis.unit,
      },
    };
  }

  // ✔ Los de pimienta usan la receta completa original
  return base;
};
