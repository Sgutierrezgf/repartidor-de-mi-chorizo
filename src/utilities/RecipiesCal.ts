interface IngredientValue {
  value: number;
  unit: string;
}

interface Ingredients {
  Pierna: IngredientValue;
  Tocino: IngredientValue;
  Comino: IngredientValue;
  Cilantro: IngredientValue;
  Cebolla_rama: IngredientValue;
  Sal: IngredientValue;
  Curcuma: IngredientValue;
  Ajo: IngredientValue;
  Pimentón: IngredientValue;
  Polyfosfato: IngredientValue;
  Humo_líquido: IngredientValue;
  Pimienta_Luis: IngredientValue;
  Tripa: IngredientValue;
  Agua?: IngredientValue;
}

interface IngredientDetail {
  quantity: number;
}

export const ingredientesBase = (detail: IngredientDetail): Ingredients => {
  const { quantity } = detail;

  const Pierna = 100 * quantity * 0.78;
  const Tocino = 100 * quantity * 0.14;

  return {
    Pierna: { value: Pierna, unit: "grms" },
    Tocino: { value: Tocino, unit: "grms" },
    Comino: { value: 100 * quantity * 0.0021, unit: "grms" },
    Cilantro: { value: 100 * quantity * 0.0085, unit: "grms" },
    Cebolla_rama: { value: 100 * quantity * 0.04, unit: "grms" },
    Sal: { value: 100 * quantity * 0.0167, unit: "grms" },
    Curcuma: { value: 100 * quantity * 0.004, unit: "grms" },
    Ajo: { value: 100 * quantity * 0.02, unit: "grms" },
    Pimentón: { value: 100 * quantity * 0.02, unit: "grms" },
    Polyfosfato: { value: ((Pierna + Tocino) * 9) / 1000, unit: "grms" },
    Humo_líquido: { value: ((Pierna + Tocino) * 2) / 1000, unit: "cc" },
    Pimienta_Luis: { value: ((Pierna + Tocino) * 6) / 1000, unit: "grms" },
    Tripa: { value: (quantity * 1.3) / 5, unit: "mts" },
    Agua: { value: (Pierna + Tocino) * 0.1, unit: "grms" },
  };
};
