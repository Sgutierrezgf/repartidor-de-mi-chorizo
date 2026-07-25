import { useState } from "react";
import { getIngredientesPorTipo } from "../../../utilities/ingredientesPorTipo";
import { Panel } from "../../../components/ui/Panel";

type ProductType = "normal" | "picante" | "pimienta";

const productTypes: { id: ProductType; label: string }[] = [
  { id: "normal", label: "Normal" },
  { id: "pimienta", label: "Pimienta" },
  { id: "picante", label: "Picante" },
];

const Receta = () => {
  const [cantidades, setCantidades] = useState<Record<ProductType, number>>({
    normal: 0,
    picante: 0,
    pimienta: 0,
  });

  return (
    <section className="space-y-8">
      <header className="space-y-1">
        <h1 className="font-display text-3xl font-bold">Receta</h1>
        <p className="text-ink-muted">
          Calcula ingredientes por tipo de chorizo según lo que vas a producir.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-3">
        {productTypes.map((p) => (
          <Panel key={p.id}>
            <label className="mb-2 block text-sm font-semibold" htmlFor={p.id}>
              {p.label}
            </label>
            <input
              id={p.id}
              type="number"
              min={0}
              value={cantidades[p.id]}
              onChange={(e) => {
                const value = Number(e.target.value);
                setCantidades((prev) => ({
                  ...prev,
                  [p.id]: value > 0 ? value : 0,
                }));
              }}
              className="w-full rounded-md border border-line bg-paper px-3 py-2 outline-none focus:border-blood"
            />
          </Panel>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {productTypes.map(({ id, label }) => {
          const cantidad = cantidades[id];
          if (cantidad <= 0) return null;
          const ingredientes = getIngredientesPorTipo(id, cantidad);

          return (
            <Panel key={id} className="overflow-hidden p-0">
              <div className="border-b border-line px-4 py-3">
                <h2 className="font-display text-lg font-bold">
                  {label} · {cantidad}
                </h2>
              </div>
              <ul className="divide-y divide-line text-sm">
                {Object.entries(ingredientes).map(([key, { value, unit }]) => (
                  <li
                    key={key}
                    className="flex items-center justify-between px-4 py-2"
                  >
                    <span className="capitalize">{key.replaceAll("_", " ")}</span>
                    <span className="font-semibold">
                      {value.toFixed(1)} {unit}
                    </span>
                  </li>
                ))}
              </ul>
            </Panel>
          );
        })}
      </div>
    </section>
  );
};

export default Receta;
