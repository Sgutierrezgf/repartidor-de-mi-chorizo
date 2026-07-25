import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Panel } from "../../../components/ui/Panel";
import { StatusPill } from "../../../components/ui/StatusPill";
import { Button } from "../../../components/bottons/Button";
import {
  createEnvio,
  getEnvios,
  getReportesByShipmentIds,
  summarizeReportes,
  totalEnviado,
  type Envio,
  type ReporteVenta,
} from "../../../services/enviosApi";

const envioSchema = z
  .object({
    person_name: z.string().min(2, "Escribe quién recibe"),
    normal: z.number().min(0),
    pepper: z.number().min(0),
    spicy: z.number().min(0),
    notes: z.string().optional(),
  })
  .refine((v) => v.normal + v.pepper + v.spicy > 0, {
    message: "Envía al menos 1 paquete",
    path: ["normal"],
  });

type EnvioForm = z.infer<typeof envioSchema>;

const Envios = () => {
  const [envios, setEnvios] = useState<Envio[]>([]);
  const [reportes, setReportes] = useState<ReporteVenta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EnvioForm>({
    resolver: zodResolver(envioSchema),
    defaultValues: { person_name: "", normal: 0, pepper: 0, spicy: 0, notes: "" },
  });

  const load = async () => {
    setLoading(true);
    setError(null);
    const data = await getEnvios();
    if (!data) {
      setError("No se pudieron cargar los envíos. ¿Corriste supabase/schema.sql?");
      setLoading(false);
      return;
    }
    setEnvios(data);
    const allReportes = await getReportesByShipmentIds(data.map((e) => e.id));
    setReportes(allReportes ?? []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const statsByEnvio = useMemo(() => {
    const map = new Map<number, ReturnType<typeof summarizeReportes>>();
    for (const envio of envios) {
      const own = reportes.filter((r) => r.shipment_id === envio.id);
      map.set(envio.id, summarizeReportes(own));
    }
    return map;
  }, [envios, reportes]);

  const onSubmit = async (data: EnvioForm) => {
    setSaving(true);
    setError(null);
    const { error: createError } = await createEnvio(data);
    setSaving(false);
    if (createError) {
      setError(createError);
      return;
    }
    reset({ person_name: "", normal: 0, pepper: 0, spicy: 0, notes: "" });
    await load();
  };

  return (
    <section className="space-y-8">
      <header className="space-y-1">
        <h1 className="font-display text-3xl font-bold">Envíos</h1>
        <p className="text-ink-muted">
          Lotes que mandas a otra persona para que venda. Luego marcas cuántos
          vendió (cualquier día) y si ya te pagó.
        </p>
      </header>

      {error && (
        <p className="rounded-md border border-blood/30 bg-blood/10 px-3 py-2 text-sm text-blood" role="alert">
          {error}
        </p>
      )}

      <Panel>
        <h2 className="font-display text-xl font-bold">Nuevo envío</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="mb-1 block text-sm font-semibold">Persona / lugar</label>
            <input
              {...register("person_name")}
              className="w-full rounded-md border border-line bg-paper px-3 py-2 outline-none focus:border-blood"
              placeholder="Ej. Juan del mercado"
            />
            {errors.person_name && (
              <p className="mt-1 text-sm text-blood">{errors.person_name.message}</p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold">Normal</label>
            <input
              type="number"
              min={0}
              {...register("normal", { valueAsNumber: true })}
              className="w-full rounded-md border border-line bg-paper px-3 py-2"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold">Pimienta</label>
            <input
              type="number"
              min={0}
              {...register("pepper", { valueAsNumber: true })}
              className="w-full rounded-md border border-line bg-paper px-3 py-2"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold">Picante</label>
            <input
              type="number"
              min={0}
              {...register("spicy", { valueAsNumber: true })}
              className="w-full rounded-md border border-line bg-paper px-3 py-2"
            />
            {errors.normal && (
              <p className="mt-1 text-sm text-blood">{errors.normal.message}</p>
            )}
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold">Nota (opcional)</label>
            <input
              {...register("notes")}
              className="w-full rounded-md border border-line bg-paper px-3 py-2"
              placeholder="Ej. lote del sábado"
            />
          </div>

          <div className="sm:col-span-2">
            <Button type="submit" disabled={saving}>
              {saving ? "Guardando…" : "Registrar envío"}
            </Button>
          </div>
        </form>
      </Panel>

      <div className="space-y-3">
        <h2 className="font-display text-xl font-bold">Tus envíos</h2>
        {loading ? (
          <p className="text-ink-muted">Cargando…</p>
        ) : envios.length === 0 ? (
          <Panel>
            <p className="text-ink-muted">Aún no hay envíos.</p>
          </Panel>
        ) : (
          envios.map((envio) => {
            const sent = totalEnviado(envio);
            const stats = statsByEnvio.get(envio.id) ?? {
              vendidos: 0,
              porCobrar: 0,
              cobrados: 0,
            };
            const quedan = Math.max(sent - stats.vendidos, 0);

            return (
              <Panel key={envio.id} className="space-y-3">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="font-display text-lg font-bold">{envio.person_name}</h3>
                    <p className="text-sm text-ink-muted">
                      Enviado: {sent} ({envio.normal}n / {envio.pepper}pim / {envio.spicy}pic)
                    </p>
                  </div>
                  <StatusPill tone={envio.closed ? "neutral" : quedan === 0 ? "ok" : "blood"}>
                    {envio.closed ? "Cerrado" : quedan === 0 ? "Sin stock" : "Abierto"}
                  </StatusPill>
                </div>

                <div className="flex flex-wrap gap-2 text-sm">
                  <StatusPill tone="neutral">{`Vendidos ${stats.vendidos}`}</StatusPill>
                  <StatusPill tone="neutral">{`Quedan ${quedan}`}</StatusPill>
                  <StatusPill tone={stats.porCobrar ? "warn" : "ok"}>
                    {`Por cobrar ${stats.porCobrar}`}
                  </StatusPill>
                </div>

                <Link
                  to={`/private/envios/${envio.id}`}
                  className="inline-flex text-sm font-semibold text-blood hover:underline"
                >
                  Ver detalle y marcar ventas →
                </Link>
              </Panel>
            );
          })
        )}
      </div>
    </section>
  );
};

export default Envios;
