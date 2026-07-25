import { useEffect, useState } from "react";
import { Panel } from "../../../components/ui/Panel";
import { Button } from "../../../components/bottons/Button";
import { getCyclesSummary } from "../../../services/ventasApi";
import type { CycleSummary, ReporteCiclo } from "../../../types/cycles";

const money = (n: number) =>
  n.toLocaleString("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 });

const Resumen = () => {
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
        <h1 className="font-display text-3xl font-bold">Resumen</h1>
        <p className="text-ink-muted">
          Mira un ciclo de pedidos y calcula ingresos / gastos / ganancia.
        </p>
      </header>

      <Panel className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-semibold">Ciclo</label>
          <select
            className="w-full rounded-md border border-line bg-paper px-3 py-2"
            value={selectedCycle === "" ? "" : String(selectedCycle)}
            onChange={(e) =>
              setSelectedCycle(e.target.value === "" ? "" : Number(e.target.value))
            }
          >
            <option value="">Selecciona un ciclo</option>
            {cycles.map((cycle) => (
              <option key={cycle.id} value={cycle.id}>
                Ciclo #{cycle.id}
                {cycle.is_open ? " (abierto)" : ""} —{" "}
                {new Date(cycle.created_at).toLocaleDateString("es-CO")}
              </option>
            ))}
          </select>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-semibold">
              Costos de producción
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
            <label className="mb-1 block text-sm font-semibold">Domicilios</label>
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
          Generar reporte
        </Button>
      </Panel>

      {reporte && cicloInfo && (
        <div className="space-y-4">
          <Panel>
            <h2 className="font-display text-xl font-bold">
              Ciclo #{cicloInfo.id}
            </h2>
            <p className="mt-1 text-sm text-ink-muted">
              {new Date(cicloInfo.created_at).toLocaleDateString("es-CO")}
            </p>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
              <div className="rounded-md bg-paper p-3">
                <p className="text-xs text-ink-muted">Clientes</p>
                <p className="text-lg font-bold">{cicloInfo.totalClients}</p>
              </div>
              <div className="rounded-md bg-paper p-3">
                <p className="text-xs text-ink-muted">Normal</p>
                <p className="text-lg font-bold">{cicloInfo.totalNormal}</p>
              </div>
              <div className="rounded-md bg-paper p-3">
                <p className="text-xs text-ink-muted">Pimienta</p>
                <p className="text-lg font-bold">{cicloInfo.totalPepper}</p>
              </div>
              <div className="rounded-md bg-paper p-3">
                <p className="text-xs text-ink-muted">Picante</p>
                <p className="text-lg font-bold">{cicloInfo.totalSpicy}</p>
              </div>
              <div className="rounded-md bg-paper p-3">
                <p className="text-xs text-ink-muted">Total paquetes</p>
                <p className="text-lg font-bold">{cicloInfo.total}</p>
              </div>
              <div className="rounded-md bg-paper p-3">
                <p className="text-xs text-ink-muted">Pagados</p>
                <p className="text-lg font-bold">{cicloInfo.totalPaid}</p>
              </div>
            </div>
          </Panel>

          <Panel>
            <h3 className="font-display text-lg font-bold">Finanzas</h3>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                Pedidos: <strong>{reporte.pedidos}</strong>
              </li>
              <li>
                Ingresos: <strong>{money(reporte.ingresos)}</strong>
              </li>
              <li>
                Domicilios: <strong>{money(reporte.domicilioTotal)}</strong>
              </li>
              <li>
                Producción: <strong>{money(reporte.gastos)}</strong>
              </li>
              <li className="border-t border-line pt-3">
                Ganancia:{" "}
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
