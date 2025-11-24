import { useState } from "react";
import { getIngredientesPorTipo } from "../../../utilities/ingredientesPorTipo";

type ProductType = "normal" | "picante" | "pimienta";

const productTypes: { id: ProductType; label: string }[] = [
  { id: "normal", label: "Normal" },
  { id: "pimienta", label: "Pimienta" },
  { id: "picante", label: "Picante" },
];

const Recipes = () => {
  const [cantidades, setCantidades] = useState<Record<ProductType, number>>({
    normal: 0,
    picante: 0,
    pimienta: 0,
  });

  const handleChange = (type: ProductType, value: number) => {
    setCantidades((prev) => ({
      ...prev,
      [type]: value > 0 ? value : 0,
    }));
  };

  return (
    <section className="max-w-3xl mx-auto p-4 font-sans mt-4">
      <h2 className="text-2xl font-bold mb-6">
        🧂 Calculadora de ingredientes
      </h2>

      {/* --- VERSION DESKTOP --- */}
      <div className="hidden md:grid grid-cols-3 gap-4">
        {productTypes.map(({ id, label }) => (
          <div key={id} className="bg-white shadow-md p-4 rounded-xl border">
            <label className="block font-semibold mb-2">{label}</label>
            <input
              type="number"
              min="0"
              value={cantidades[id]}
              onChange={(e) => handleChange(id, Number(e.target.value))}
              className="w-full p-2 border rounded-md"
            />
          </div>
        ))}
      </div>

      {/* --- RECETAS DESKTOP --- */}
      <div className="hidden md:grid grid-cols-3 gap-6 mt-8">
        {productTypes.map(({ id }) => {
          const cantidad = cantidades[id];
          if (cantidad <= 0) return null;

          const ingredientes = getIngredientesPorTipo(id, cantidad);

          return (
            <div
              key={id}
              className="bg-white border rounded-2xl shadow-md p-6 w-full min-h-[250px]
                     transition hover:shadow-lg hover:-translate-y-1"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-indigo-100 text-indigo-600 text-xl">
                  🥣
                </div>
                <h3 className="text-lg font-bold">
                  Ingredientes para {cantidad} Chorizos
                </h3>
              </div>

              <ul className="space-y-2">
                {Object.entries(ingredientes).map(([key, { value, unit }]) => (
                  <li
                    key={key}
                    className="flex items-center justify-between bg-gray-50 px-4 py-2 rounded-lg border"
                  >
                    <span className="font-medium capitalize">
                      {key.replace("_", " ")}
                    </span>
                    <span className="font-semibold">
                      {value.toFixed()} {unit}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      {/* --- VERSION MOBILE: INPUT + RECETA JUNTOS --- */}
      <div className="md:hidden space-y-10">
        {productTypes.map(({ id, label }) => {
          const cantidad = cantidades[id];
          const ingredientes =
            cantidad > 0 ? getIngredientesPorTipo(id, cantidad) : null;

          return (
            <div key={id} className="space-y-4">
              {/* INPUT */}
              <div className="bg-white shadow-md p-4 rounded-xl border">
                <label className="block font-semibold mb-2">{label}</label>
                <input
                  type="number"
                  min="0"
                  value={cantidades[id]}
                  onChange={(e) => handleChange(id, Number(e.target.value))}
                  className="w-full p-2 border rounded-md"
                />
              </div>

              {/* RECETA SOLO SI HAY CANTIDAD */}
              {cantidad > 0 && (
                <div
                  className="bg-white border rounded-2xl shadow-md p-6 w-full
                         transition hover:shadow-lg hover:-translate-y-1"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 flex items-center justify-center rounded-full bg-indigo-100 text-indigo-600 text-xl">
                      🥣
                    </div>
                    <h3 className="text-xl font-bold">
                      Ingredientes para {cantidad} Chorizos
                    </h3>
                  </div>

                  <ul className="space-y-2">
                    {Object.entries(ingredientes!).map(
                      ([key, { value, unit }]) => (
                        <li
                          key={key}
                          className="flex items-center justify-between bg-gray-50 px-4 py-2 rounded-lg border"
                        >
                          <span className="font-medium capitalize">
                            {key.replace("_", " ")}
                          </span>
                          <span className="font-semibold">
                            {value.toFixed()} {unit}
                          </span>
                        </li>
                      )
                    )}
                  </ul>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Recipes;
