import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
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

const Envios = () => {
  const { t } = useTranslation();

  const envioSchema = useMemo(
    () =>
      z
        .object({
          person_name: z.string().min(2, t("envios.personRequired")),
          normal: z.number().min(0),
          pepper: z.number().min(0),
          spicy: z.number().min(0),
          notes: z.string().optional(),
        })
        .refine((v) => v.normal + v.pepper + v.spicy > 0, {
          message: t("envios.minPackages"),
          path: ["normal"],
        }),
    [t]
  );

  type EnvioForm = z.infer<typeof envioSchema>;

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
      setError(t("envios.loadError"));
      setLoading(false);
      return;
    }
    setEnvios(data);
    const allReportes = await getReportesByShipmentIds(data.map((e) => e.id));
    setReportes(allReportes ?? []);
    setLoading(false);
  };

  useEffect(() => {
    void load();
    // Initial load only
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        <h1 className="font-display text-3xl font-bold">{t("envios.title")}</h1>
        <p className="text-ink-muted">{t("envios.subtitle")}</p>
      </header>

      {error && (
        <p className="rounded-md border border-blood/30 bg-blood/10 px-3 py-2 text-sm text-blood" role="alert">
          {error}
        </p>
      )}

      <Panel>
        <h2 className="font-display text-xl font-bold">{t("envios.newShipment")}</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="mb-1 block text-sm font-semibold">
              {t("envios.personPlace")}
            </label>
            <input
              {...register("person_name")}
              className="w-full rounded-md border border-line bg-paper px-3 py-2 outline-none focus:border-blood"
              placeholder={t("envios.personPlaceholder")}
            />
            {errors.person_name && (
              <p className="mt-1 text-sm text-blood">{errors.person_name.message}</p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold">{t("common.normal")}</label>
            <input
              type="number"
              min={0}
              {...register("normal", { valueAsNumber: true })}
              className="w-full rounded-md border border-line bg-paper px-3 py-2"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold">{t("common.pepper")}</label>
            <input
              type="number"
              min={0}
              {...register("pepper", { valueAsNumber: true })}
              className="w-full rounded-md border border-line bg-paper px-3 py-2"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold">{t("common.spicy")}</label>
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
            <label className="mb-1 block text-sm font-semibold">{t("common.note")}</label>
            <input
              {...register("notes")}
              className="w-full rounded-md border border-line bg-paper px-3 py-2"
              placeholder={t("envios.notePlaceholder")}
            />
          </div>

          <div className="sm:col-span-2">
            <Button type="submit" disabled={saving}>
              {saving ? t("common.saving") : t("envios.saveShipment")}
            </Button>
          </div>
        </form>
      </Panel>

      <div className="space-y-3">
        <h2 className="font-display text-xl font-bold">{t("envios.listTitle")}</h2>
        {loading ? (
          <p className="text-ink-muted">{t("common.loading")}</p>
        ) : envios.length === 0 ? (
          <Panel>
            <p className="text-ink-muted">{t("envios.empty")}</p>
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
                      {t("envios.sent", {
                        total: sent,
                        normal: envio.normal,
                        pepper: envio.pepper,
                        spicy: envio.spicy,
                      })}
                    </p>
                  </div>
                  <StatusPill tone={envio.closed ? "neutral" : quedan === 0 ? "ok" : "blood"}>
                    {envio.closed
                      ? t("envios.closed")
                      : quedan === 0
                        ? t("envios.noStock")
                        : t("envios.open")}
                  </StatusPill>
                </div>

                <div className="flex flex-wrap gap-2 text-sm">
                  <StatusPill tone="neutral">
                    {t("envios.sold", { count: stats.vendidos })}
                  </StatusPill>
                  <StatusPill tone="neutral">
                    {t("envios.remaining", { count: quedan })}
                  </StatusPill>
                  <StatusPill tone={stats.porCobrar ? "warn" : "ok"}>
                    {t("envios.unpaid", { count: stats.porCobrar })}
                  </StatusPill>
                </div>

                <Link
                  to={`/private/envios/${envio.id}`}
                  className="inline-flex text-sm font-semibold text-blood hover:underline"
                >
                  {t("envios.viewDetail")}
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
