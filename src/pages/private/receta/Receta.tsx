import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { MEAT_MIXES, type MeatMix } from "../../../utilities/RecipiesCal";
import {
  formatIngredientDisplay,
  ingredientLabel,
  type MassUnit,
} from "../../../utilities/formatIngredient";
import {
  buildRecipeMatrix,
  RECIPE_TYPES,
  type QtyByType,
} from "../../../utilities/recipeMatrix";
import type { ProductType } from "../../../utilities/ingredientesPorTipo";
import { Panel } from "../../../components/ui/Panel";

const MASS_STORAGE_KEY = "receta-mass-unit";
const MIX_STORAGE_KEY = "receta-meat-mix";

function readMassUnit(): MassUnit {
  return localStorage.getItem(MASS_STORAGE_KEY) === "lb" ? "lb" : "kg";
}

function readMix(): MeatMix {
  const stored = localStorage.getItem(MIX_STORAGE_KEY);
  if (stored === "90-10" || stored === "80-20" || stored === "85-15") {
    return stored;
  }
  return "85-15";
}

const Receta = () => {
  const { t } = useTranslation();

  const typeLabels = useMemo(
    (): Record<ProductType, string> => ({
      normal: t("common.normal"),
      pimienta: t("common.pepper"),
      picante: t("common.spicy"),
    }),
    [t]
  );

  const [cantidades, setCantidades] = useState<Record<ProductType, string>>({
    normal: "",
    picante: "",
    pimienta: "",
  });
  const [massUnit, setMassUnit] = useState<MassUnit>(() => readMassUnit());
  const [mix, setMix] = useState<MeatMix>(() => readMix());

  const quantities: QtyByType = {
    normal: Number(cantidades.normal) || 0,
    pimienta: Number(cantidades.pimienta) || 0,
    picante: Number(cantidades.picante) || 0,
  };

  const matrix = useMemo(
    () => buildRecipeMatrix(quantities, mix),
    // quantities derived from cantidades strings
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [cantidades.normal, cantidades.pimienta, cantidades.picante, mix]
  );

  const onMassUnitChange = (unit: MassUnit) => {
    setMassUnit(unit);
    localStorage.setItem(MASS_STORAGE_KEY, unit);
  };

  const onMixChange = (next: MeatMix) => {
    setMix(next);
    localStorage.setItem(MIX_STORAGE_KEY, next);
  };

  const onQtyChange = (id: ProductType, raw: string) => {
    if (raw === "" || /^\d*$/.test(raw)) {
      setCantidades((prev) => ({ ...prev, [id]: raw }));
    }
  };

  const formatCellForKey = (
    key: string,
    cell: { value: number; unit: string } | null | undefined
  ) => {
    if (!cell || cell.value <= 0) return "—";
    const display = formatIngredientDisplay(key, cell, massUnit);
    return `${display.value} ${display.unit}`;
  };

  const totalPackages =
    quantities.normal + quantities.pimienta + quantities.picante;

  return (
    <section className="space-y-8">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-wood">
            {t("receta.sheetBadge")}
          </p>
          <h1 className="font-display text-3xl font-bold">{t("receta.title")}</h1>
          <p className="max-w-xl text-ink-muted">{t("receta.matrixSubtitle")}</p>
        </div>

        <div
          className="inline-flex rounded-md border border-line bg-paper p-0.5"
          role="group"
          aria-label={t("receta.massUnit")}
        >
          {(["kg", "lb"] as const).map((unit) => (
            <button
              key={unit}
              type="button"
              onClick={() => onMassUnitChange(unit)}
              className={`rounded px-3 py-1.5 text-xs font-semibold transition-colors ${
                massUnit === unit
                  ? "bg-blood text-surface"
                  : "text-ink-muted hover:text-ink"
              }`}
            >
              {t(`receta.${unit}`)}
            </button>
          ))}
        </div>
      </header>

      <Panel className="space-y-5">
        <div>
          <p className="mb-2 text-sm font-semibold">{t("receta.mixTitle")}</p>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(MEAT_MIXES) as MeatMix[]).map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => onMixChange(key)}
                className={`rounded-md border px-3 py-2 text-sm font-semibold transition-colors ${
                  mix === key
                    ? "border-blood bg-blood/10 text-blood"
                    : "border-line bg-paper text-ink-muted hover:text-ink"
                }`}
              >
                {key}
                {key === "85-15" ? (
                  <span className="ml-1 text-xs font-normal opacity-80">
                    · {t("receta.traditional")}
                  </span>
                ) : null}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-2 text-sm font-semibold">{t("receta.typeTitle")}</p>
          <div className="grid gap-3 sm:grid-cols-3">
            {RECIPE_TYPES.map((id) => (
              <label
                key={id}
                className="rounded-md border border-line bg-paper p-3"
              >
                <span className="font-display text-sm font-bold">
                  {typeLabels[id]}
                </span>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder={t("receta.qtyPlaceholder")}
                  value={cantidades[id]}
                  onChange={(e) => onQtyChange(id, e.target.value)}
                  className="mt-2 w-full rounded-md border border-line bg-surface px-3 py-2 text-sm outline-none focus:border-blood"
                />
              </label>
            ))}
          </div>
          {totalPackages > 0 && (
            <p className="mt-2 text-sm text-ink-muted">
              {t("receta.totalPackages", { count: totalPackages })}
            </p>
          )}
        </div>
      </Panel>

      {!matrix.anyActive ? (
        <Panel>
          <p className="text-center text-ink-muted">{t("receta.matrixEmpty")}</p>
        </Panel>
      ) : (
        <Panel className="overflow-hidden p-0">
          <div className="border-b border-line px-4 py-3 sm:px-5">
            <h2 className="font-display text-lg font-bold">
              {t("receta.matrixTitle")}
            </h2>
            <p className="text-sm text-ink-muted">{t("receta.matrixHelp")}</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="border-b border-line bg-paper-deep/50 text-ink-muted">
                <tr>
                  <th className="sticky left-0 bg-paper-deep/50 px-4 py-3 font-semibold backdrop-blur-sm">
                    {t("receta.ingredient")}
                  </th>
                  {RECIPE_TYPES.map((type) => (
                    <th key={type} className="px-4 py-3 font-semibold">
                      <span
                        className={
                          quantities[type] > 0 ? "text-ink" : "opacity-40"
                        }
                      >
                        {typeLabels[type]}
                      </span>
                      {quantities[type] > 0 && (
                        <span className="mt-0.5 block text-xs font-normal text-ink-muted">
                          ×{quantities[type]}
                        </span>
                      )}
                    </th>
                  ))}
                  <th className="bg-blood/10 px-4 py-3 font-semibold text-blood">
                    {t("receta.totalCol")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {matrix.rows.map((row) => {
                  const isSub =
                    row.key === "Pierna_molido" || row.key === "Pierna_picado";
                  const isSection =
                    row.key === "Pierna" || row.key === "Tocino";

                  return (
                    <tr
                      key={row.key}
                      className={`border-t border-line ${
                        isSection ? "bg-paper-deep/20" : ""
                      }`}
                    >
                      <td
                        className={`sticky left-0 bg-surface px-4 py-2.5 font-medium capitalize ${
                          isSub ? "pl-8 text-ink-muted" : ""
                        } ${isSection ? "font-semibold" : ""}`}
                      >
                        {row.key === "Pierna_molido"
                          ? t("receta.molido")
                          : row.key === "Pierna_picado"
                            ? t("receta.picado")
                            : ingredientLabel(row.key)}
                      </td>
                      {RECIPE_TYPES.map((type) => (
                        <td
                          key={type}
                          className={`px-4 py-2.5 tabular-nums ${
                            quantities[type] > 0
                              ? "text-ink"
                              : "text-ink-muted/40"
                          }`}
                        >
                          {quantities[type] > 0
                            ? formatCellForKey(row.key, row.byType[type])
                            : "—"}
                        </td>
                      ))}
                      <td className="bg-blood/5 px-4 py-2.5 font-semibold tabular-nums text-blood">
                        {formatCellForKey(row.key, row.total)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="border-t border-line px-4 py-3 text-xs text-ink-muted sm:px-5">
            {t("receta.matrixFooter")}
          </div>
        </Panel>
      )}
    </section>
  );
};

export default Receta;
