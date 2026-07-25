import type { IngredientValue } from "./RecipiesCal";

export type MassUnit = "kg" | "lb";

const BULK_MASS_KEYS = new Set([
  "Pierna",
  "Pierna_molido",
  "Pierna_picado",
  "Tocino",
  "Agua",
]);

const LB_PER_GRAM = 1 / 453.59237;

export const gramsToMass = (grams: number, unit: MassUnit): number =>
  unit === "kg" ? grams / 1000 : grams * LB_PER_GRAM;

export const formatMass = (grams: number, unit: MassUnit): string =>
  `${gramsToMass(grams, unit).toFixed(2)} ${unit}`;

export const formatIngredientDisplay = (
  key: string,
  ingredient: IngredientValue,
  massUnit: MassUnit
): { value: string; unit: string } => {
  if (BULK_MASS_KEYS.has(key) && ingredient.unit === "grms") {
    return {
      value: gramsToMass(ingredient.value, massUnit).toFixed(2),
      unit: massUnit,
    };
  }

  if (ingredient.unit === "grms") {
    return { value: ingredient.value.toFixed(1), unit: "g" };
  }

  if (ingredient.unit === "und") {
    return { value: ingredient.value.toFixed(1), unit: "und" };
  }

  if (ingredient.unit === "hrs") {
    return { value: ingredient.value.toFixed(2), unit: "h" };
  }

  return {
    value: ingredient.value.toFixed(1),
    unit: ingredient.unit,
  };
};

export const ingredientLabel = (key: string): string =>
  key.replaceAll("_", " ");
