import { useEffect, useState } from "react";
import { getCyclesSummary } from "../../../services/ClientsApi";
import type { CycleSummary, ReporteCiclo } from "../../../types/cycles";
import { useTranslation } from "react-i18next";


const Resume = () => {
 const [cycles, setCycles] = useState<CycleSummary[]>([]);
  const [selectedCycle, setSelectedCycle] = useState<number | "">("");

  const [costosProduccion, setCostosProduccion] = useState("");
  const [domicilio, setDomicilio] = useState("");

  const [reporte, setReporte] = useState<ReporteCiclo | null>(null);
  const [cicloInfo, setCicloInfo] = useState<CycleSummary | null>(null);

  const {t} = useTranslation();

  useEffect(() => {
    getCyclesSummary().then(setCycles);
  }, []);

  const generarReporte = () => {
    const ciclo = cycles.find((c) => c.id === Number(selectedCycle));
    if (!ciclo) return;

    const pedidos = ciclo.total;
    const ingresos = pedidos * 20000;
    const domicilioTotal = Number(domicilio) || 0;
    const gastos = Number(costosProduccion) || 0;
    const ganancia = ingresos + domicilioTotal - gastos;

    setCicloInfo(ciclo);
    setReporte({
      pedidos,
      ingresos,
      domicilioTotal,
      gastos,
      ganancia,
    });
  };

  return (
    <section className="max-w-3xl mx-auto px-4 py-10 pt-20">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-8 text-center">
        📊 {t("cycles.title")}
      </h1>

      {/* SELECCIÓN DE CICLO */}
      <div className="mb-6">
        <label className="block mb-2 text-gray-700 dark:text-gray-300 font-medium">
          {t("cycles.select")}
        </label>

        <select
          className="w-full mb-4 p-3 rounded-lg border border-gray-300 dark:border-gray-700 
            bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          value={selectedCycle || ""}
          onChange={(e) => setSelectedCycle(e.target.value === "" ? "" : Number(e.target.value))}
        >
          <option value="">{t("cycles.select_cycle")}</option>
          {cycles.map((cycle) => (
            <option key={cycle.id} value={cycle.id}>
              {t("cycles.Ciclo")} #{cycle.id}
            </option>
          ))}
        </select>
      </div>

      {/* CAMPOS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">

        <div>
          <label className="block mb-1 text-gray-700 dark:text-gray-300 font-medium">
           {t("cycles.costs")}
          </label>
          <input
            type="number"
            placeholder="Ej: 150000"
            value={costosProduccion}
            onChange={(e) => setCostosProduccion(e.target.value)}
            className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 
              bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          />
        </div>

        <div>
          <label className="block mb-1 text-gray-700 dark:text-gray-300 font-medium">
            {t("cycles.delivery_costs")}
          </label>
          <input
            type="number"
            placeholder="Ej: 2000"
            value={domicilio}
            onChange={(e) => setDomicilio(e.target.value)}
            className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 
              bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          />
        </div>

      </div>

      {/* BOTÓN */}
      <button
        className="w-full py-3 bg-blue-600 hover:bg-blue-700 
          text-white font-semibold rounded-lg shadow-lg transition"
        onClick={generarReporte}
      >
        {t("cycles.boton")}
      </button>

      {/* RESULTADOS */}
      {reporte && cicloInfo && (
        <div className="mt-10 space-y-6">
          {/* INFORMACIÓN DEL CICLO */}
          <div className="p-6 rounded-xl bg-white dark:bg-gray-800 shadow-md border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-3">
              {t("cycles.Ciclo")} #{cicloInfo.id}
            </h2>

            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              {t("cycles.fecha")}: {new Date(cicloInfo.created_at).toLocaleDateString("es-CO")}
            </p>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <p className="text-xs text-gray-500">{t("cycles.clients")}</p>
                <p className="text-lg font-bold">{cicloInfo.totalClients}</p>
              </div>

              <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <p className="text-xs text-gray-500">{t("orders.normal")}</p>
                <p className="text-lg font-bold text-blue-500">{cicloInfo.totalNormal}</p>
              </div>

              <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <p className="text-xs text-gray-500">{t("orders.spicy")}</p>
                <p className="text-lg font-bold text-red-500">{cicloInfo.totalSpicy}</p>
              </div>

              <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <p className="text-xs text-gray-500">{t("orders.pepper")}</p>
                <p className="text-lg font-bold text-purple-500">{cicloInfo.totalPepper}</p>
              </div>

              <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <p className="text-xs text-gray-500">{t("cycles.total")}</p>
                <p className="text-lg font-bold text-green-600">{cicloInfo.total}</p>
              </div>
            </div>
          </div>

          {/* REPORTE NUMÉRICO */}
          <div className="p-6 rounded-xl bg-gray-100 dark:bg-gray-900 shadow-md border border-gray-300 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
              {t("cycles.financial")}
            </h3>

            <ul className="space-y-2 text-gray-700 dark:text-gray-300">
              <li>{t("navbar.orders")}: <strong>{reporte.pedidos}</strong></li>
              <li>{t("cycles.Income")}: <strong>${reporte.ingresos.toLocaleString("es-CO")}</strong></li>
              <li>{t("cycles.delivery_costs")}: <strong>${reporte.domicilioTotal.toLocaleString("es-CO")}</strong></li>
              <li>{t("cycles.production_costs")}: <strong>${reporte.gastos.toLocaleString("es-CO")}</strong></li>

              <li className="pt-3 border-t border-gray-400 dark:border-gray-700">
                {t("cycles.profit")}:{" "}
                <strong
                  className={
                    reporte.ganancia >= 0
                      ? "text-green-600 dark:text-green-400"
                      : "text-red-600 dark:text-red-400"
                  }
                >
                  ${reporte.ganancia.toLocaleString("es-CO")}
                </strong>
              </li>
            </ul>
          </div>
        </div>
      )}
    </section>
  );
};
export default Resume