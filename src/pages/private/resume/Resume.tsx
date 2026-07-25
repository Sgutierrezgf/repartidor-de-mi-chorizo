import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Panel } from "../../../components/ui/Panel";
import { Button } from "../../../components/bottons/Button";
import { getCyclesSummary } from "../../../services/ventasApi";
import type { CycleSummary, ReporteCiclo } from "../../../types/cycles";

const money = (n: number) =>
  n.toLocaleString("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 });

const Resumen = () => {
  const { t } = useTranslation();

  const [cycles, setCycles] = useState<CycleSummary[]>([]);
  const [selectedCycle, setSelectedCycle] = useState<number | "">("");
  const [costosProduccion, setCostosProduccion] = useState("");
  const [domicilio, setDomicilio] = useState("");
  const [reporte, setReporte] = useState<ReporteCiclo | null>(null);
  const [cicloInfo, setCicloInfo] = useState<CycleSummary | null>(null);

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
    <section className="space-y-8">
      <header className="space-y-1">
        <h1 className="font-display text-3xl font-bold">{t("resumen.title")}</h1>
        <p className="text-ink-muted">{t("resumen.subtitle")}</p>
      </header>

      <Panel className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-semibold">{t("resumen.cycle")}</label>
          <select
            className="w-full rounded-md border border-line bg-paper px-3 py-2"
            value={selectedCycle === "" ? "" : String(selectedCycle)}
            onChange={(e) =>
              setSelectedCycle(e.target.value === "" ? "" : Number(e.target.value))
            }
          >
            <option value="">{t("resumen.selectCycle")}</option>
            {cycles.map((cycle) => (
              <option key={cycle.id} value={cycle.id}>
                {t("resumen.cycleOption", {
                  id: cycle.id,
                  open: cycle.is_open ? t("resumen.openSuffix") : "",
                  date: new Date(cycle.created_at).toLocaleDateString("es-CO"),
                })}
              </option>
            ))}
          </select>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-semibold">
              {t("resumen.productionCosts")}
            </label>
            <input
              type="number"
              placeholder="Ej: 150000"
              value={costosProduccion}
              onChange={(e) => setCostosProduccion(e.target.value)}
              className="w-full rounded-md border border-line bg-paper px-3 py-2"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold">
              {t("resumen.deliveryFees")}
            </label>
            <input
              type="number"
              placeholder="Ej: 20000"
              value={domicilio}
              onChange={(e) => setDomicilio(e.target.value)}
              className="w-full rounded-md border border-line bg-paper px-3 py-2"
            />
          </div>
        </div>

        <Button onClick={generarReporte} disabled={selectedCycle === ""}>
          {t("resumen.generate")}
        </Button>
      </Panel>

      {reporte && cicloInfo && (
        <div className="space-y-4">
          <Panel>
            <h2 className="font-display text-xl font-bold">
              {t("resumen.cycleTitle", { id: cicloInfo.id })}
            </h2>
            <p className="mt-1 text-sm text-ink-muted">
              {new Date(cicloInfo.created_at).toLocaleDateString("es-CO")}
            </p>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
              <div className="rounded-md bg-paper p-3">
                <p className="text-xs text-ink-muted">{t("resumen.clients")}</p>
                <p className="text-lg font-bold">{cicloInfo.totalClients}</p>
              </div>
              <div className="rounded-md bg-paper p-3">
                <p className="text-xs text-ink-muted">{t("common.normal")}</p>
                <p className="text-lg font-bold">{cicloInfo.totalNormal}</p>
              </div>
              <div className="rounded-md bg-paper p-3">
                <p className="text-xs text-ink-muted">{t("common.pepper")}</p>
                <p className="text-lg font-bold">{cicloInfo.totalPepper}</p>
              </div>
              <div className="rounded-md bg-paper p-3">
                <p className="text-xs text-ink-muted">{t("common.spicy")}</p>
                <p className="text-lg font-bold">{cicloInfo.totalSpicy}</p>
              </div>
              <div className="rounded-md bg-paper p-3">
                <p className="text-xs text-ink-muted">{t("resumen.totalPackages")}</p>
                <p className="text-lg font-bold">{cicloInfo.total}</p>
              </div>
              <div className="rounded-md bg-paper p-3">
                <p className="text-xs text-ink-muted">{t("resumen.paidCount")}</p>
                <p className="text-lg font-bold">{cicloInfo.totalPaid}</p>
              </div>
            </div>
          </Panel>

          <Panel>
            <h3 className="font-display text-lg font-bold">{t("resumen.finance")}</h3>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                {t("resumen.orders")}: <strong>{reporte.pedidos}</strong>
              </li>
              <li>
                {t("resumen.income")}: <strong>{money(reporte.ingresos)}</strong>
              </li>
              <li>
                {t("resumen.delivery")}: <strong>{money(reporte.domicilioTotal)}</strong>
              </li>
              <li>
                {t("resumen.production")}: <strong>{money(reporte.gastos)}</strong>
              </li>
              <li className="border-t border-line pt-3">
                {t("resumen.profit")}:{" "}
                <strong className={reporte.ganancia >= 0 ? "text-ok" : "text-blood"}>
                  {money(reporte.ganancia)}
                </strong>
              </li>
            </ul>
          </Panel>
        </div>
      )}
    </section>
  );
};

export default Resumen;
