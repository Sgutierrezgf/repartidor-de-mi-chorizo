import { useMemo, useState } from "react";
import { ingredientesBase } from "../../../utilities";
import { Panel } from "../../../components/ui/Panel";

const Receta = () => {
  const [cantidad, setCantidad] = useState(1);

  const ingredientes = useMemo(
    () => ingredientesBase({ quantity: Math.max(cantidad, 1) }),
    [cantidad]
  );

  return (
    <section className="space-y-8">
      <header className="space-y-1">
        <h1 className="font-display text-3xl font-bold">Receta</h1>
        <p className="text-ink-muted">
          Calcula ingredientes según cuántos paquetes vas a producir.
        </p>
      </header>

      <Panel className="space-y-4">
        <label className="block text-sm font-semibold" htmlFor="cantidad">
          Cantidad de producto final
        </label>
        <input
          id="cantidad"
          type="number"
          min={1}
          value={cantidad}
          onChange={(e) => {
            const value = Number(e.target.value);
            setCantidad(value > 0 ? value : 1);
          }}
          className="w-full max-w-xs rounded-md border border-line bg-paper px-3 py-2 outline-none focus:border-blood"
        />
      </Panel>

      <Panel className="overflow-x-auto p-0 sm:p-0">
        <div className="border-b border-line px-5 py-4">
          <h2 className="font-display text-xl font-bold">Ingredientes</h2>
        </div>
        <table className="w-full text-left text-sm">
          <thead className="border-b border-line bg-paper-deep/50 text-ink-muted">
            <tr>
              <th className="px-4 py-3 font-semibold">Ingrediente</th>
              <th className="px-4 py-3 font-semibold">Cantidad</th>
              <th className="px-4 py-3 font-semibold">Unidad</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(ingredientes).map(([key, { value, unit }]) => (
              <tr key={key} className="border-t border-line">
                <td className="px-4 py-3 font-medium">
                  {key.replaceAll("_", " ")}
                </td>
                <td className="px-4 py-3">{value.toFixed(1)}</td>
                <td className="px-4 py-3 text-ink-muted">{unit}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>
    </section>
  );
};

export default Receta;
