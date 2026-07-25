import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { Panel } from "../../../components/ui/Panel";
import { StatusPill } from "../../../components/ui/StatusPill";
import { Button } from "../../../components/bottons/Button";
import {
  createReporte,
  getEnvio,
  getReportes,
  setEnvioClosed,
  summarizeReportes,
  totalEnviado,
  updateReportePago,
  type Envio,
  type ReporteVenta,
} from "../../../services/enviosApi";

const today = () => new Date().toISOString().slice(0, 10);

const EnvioDetalle = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const envioId = Number(id);

  const reporteSchema = useMemo(
    () =>
      z.object({
        quantity: z.number().min(1, t("ventas.minAmount")),
        sold_at: z.string().min(1, t("ventas.minAmount")),
        paid: z.boolean(),
        notes: z.string().optional(),
      }),
    [t]
  );

  type ReporteForm = z.infer<typeof reporteSchema>;

  const [envio, setEnvio] = useState<Envio | null>(null);
  const [reportes, setReportes] = useState<ReporteVenta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ReporteForm>({
    resolver: zodResolver(reporteSchema),
    defaultValues: {
      quantity: 1,
      sold_at: today(),
      paid: false,
      notes: "",
    },
  });

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      if (!Number.isFinite(envioId)) {
        if (!cancelled) {
          setError(t("envios.invalid"));
          setLoading(false);
        }
        return;
      }

      setLoading(true);
      setError(null);
      const [envioData, reportesData] = await Promise.all([
        getEnvio(envioId),
        getReportes(envioId),
      ]);

      if (cancelled) return;

      if (!envioData) {
        setError(t("envios.notFound"));
        setLoading(false);
        return;
      }

      setEnvio(envioData);
      setReportes(reportesData ?? []);
      setLoading(false);
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [envioId, t]);

  const reload = async () => {
    if (!Number.isFinite(envioId)) return;
    const [envioData, reportesData] = await Promise.all([
      getEnvio(envioId),
      getReportes(envioId),
    ]);
    if (envioData) setEnvio(envioData);
    setReportes(reportesData ?? []);
  };

  const stats = useMemo(() => summarizeReportes(reportes), [reportes]);
  const sent = envio ? totalEnviado(envio) : 0;
  const quedan = Math.max(sent - stats.vendidos, 0);

  const onSubmit = async (data: ReporteForm) => {
    if (!envio) return;

    if (data.quantity > quedan) {
      setError(t("envios.onlyRemaining", { count: quedan }));
      return;
    }

    setSaving(true);
    setError(null);
    const { error: createError } = await createReporte({
      shipment_id: envio.id,
      quantity: data.quantity,
      paid: data.paid,
      sold_at: data.sold_at,
      notes: data.notes,
    });
    setSaving(false);

    if (createError) {
      setError(createError);
      return;
    }

    reset({ quantity: 1, sold_at: today(), paid: false, notes: "" });
    await reload();
  };

  const onTogglePaid = async (reporte: ReporteVenta) => {
    const next = !reporte.paid;
    setUpdatingId(reporte.id);
    setReportes((prev) =>
      prev.map((r) => (r.id === reporte.id ? { ...r, paid: next } : r))
    );
    const { error: updateError } = await updateReportePago(reporte.id, next);
    if (updateError) {
      setError(updateError);
      setReportes((prev) =>
        prev.map((r) =>
          r.id === reporte.id ? { ...r, paid: reporte.paid } : r
        )
      );
    }
    setUpdatingId(null);
  };

  const onToggleClosed = async () => {
    if (!envio) return;
    const next = !envio.closed;
    const { error: updateError } = await setEnvioClosed(envio.id, next);
    if (updateError) {
      setError(updateError);
      return;
    }
    setEnvio({ ...envio, closed: next });
  };

  if (loading) {
    return <p className="text-ink-muted">{t("envios.loading")}</p>;
  }

  if (!envio) {
    return (
      <Panel>
        <p className="text-blood">{error ?? t("envios.notFound")}</p>
        <Link to="/private/envios" className="mt-3 inline-block text-sm font-semibold text-blood">
          {t("envios.back")}
        </Link>
      </Panel>
    );
  }

  return (
    <section className="space-y-8">
      <div>
        <Link to="/private/envios" className="text-sm font-semibold text-ink-muted hover:text-ink">
          {t("envios.back")}
        </Link>
        <header className="mt-3 space-y-2">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="font-display text-3xl font-bold">{envio.person_name}</h1>
            <StatusPill tone={envio.closed ? "neutral" : "blood"}>
              {envio.closed ? t("envios.closed") : t("envios.open")}
            </StatusPill>
          </div>
          <p className="text-ink-muted">
            {t("envios.summary", {
              sent,
              sold: stats.vendidos,
              remaining: quedan,
              unpaid: stats.porCobrar,
            })}
          </p>
          {envio.notes && (
            <p className="text-sm text-ink-muted">
              {t("envios.noteLabel", { note: envio.notes })}
            </p>
          )}
        </header>
      </div>

      {error && (
        <p className="rounded-md border border-blood/30 bg-blood/10 px-3 py-2 text-sm text-blood" role="alert">
          {error}
        </p>
      )}

      <Panel>
        <h2 className="font-display text-xl font-bold">{t("envios.markSale")}</h2>
        <p className="mt-1 text-sm text-ink-muted">{t("envios.markSaleHelp")}</p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-semibold">{t("envios.qtySold")}</label>
            <input
              type="number"
              min={1}
              max={quedan || undefined}
              {...register("quantity", { valueAsNumber: true })}
              className="w-full rounded-md border border-line bg-paper px-3 py-2"
              disabled={envio.closed || quedan === 0}
            />
            {errors.quantity && (
              <p className="mt-1 text-sm text-blood">{errors.quantity.message}</p>
            )}
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold">{t("common.date")}</label>
            <input
              type="date"
              {...register("sold_at")}
              className="w-full rounded-md border border-line bg-paper px-3 py-2"
              disabled={envio.closed || quedan === 0}
            />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1 block text-sm font-semibold">{t("common.note")}</label>
            <input
              {...register("notes")}
              className="w-full rounded-md border border-line bg-paper px-3 py-2"
              placeholder={t("envios.whatsappNote")}
              disabled={envio.closed || quedan === 0}
            />
          </div>
          <label className="flex items-center gap-2 text-sm sm:col-span-2">
            <input
              type="checkbox"
              {...register("paid")}
              className="size-4 accent-ok"
              disabled={envio.closed || quedan === 0}
            />
            {t("envios.paidThese")}
          </label>
          <div className="sm:col-span-2 flex flex-wrap gap-2">
            <Button type="submit" disabled={saving || envio.closed || quedan === 0}>
              {saving ? t("common.saving") : t("envios.addReport")}
            </Button>
            <Button type="button" variant="ghost" onClick={onToggleClosed}>
              {envio.closed ? t("envios.reopen") : t("envios.close")}
            </Button>
          </div>
        </form>
      </Panel>

      <Panel className="overflow-x-auto p-0 sm:p-0">
        <div className="border-b border-line px-5 py-4">
          <h2 className="font-display text-xl font-bold">{t("envios.history")}</h2>
        </div>
        {reportes.length === 0 ? (
          <p className="p-5 text-ink-muted">{t("envios.historyEmpty")}</p>
        ) : (
          <table className="w-full min-w-[480px] text-left text-sm">
            <thead className="border-b border-line bg-paper-deep/50 text-ink-muted">
              <tr>
                <th className="px-4 py-3 font-semibold">{t("common.date")}</th>
                <th className="px-4 py-3 font-semibold">{t("envios.qtySold")}</th>
                <th className="px-4 py-3 font-semibold">{t("common.paid")}</th>
                <th className="px-4 py-3 font-semibold">{t("common.note")}</th>
              </tr>
            </thead>
            <tbody>
              {reportes.map((reporte) => (
                <tr key={reporte.id} className="border-t border-line">
                  <td className="px-4 py-3">{reporte.sold_at}</td>
                  <td className="px-4 py-3 font-medium">{reporte.quantity}</td>
                  <td className="px-4 py-3">
                    <label className="inline-flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={reporte.paid}
                        disabled={updatingId === reporte.id}
                        onChange={() => onTogglePaid(reporte)}
                        className="size-4 accent-ok"
                      />
                      <StatusPill tone={reporte.paid ? "ok" : "warn"}>
                        {reporte.paid ? t("common.paid") : t("common.unpaid")}
                      </StatusPill>
                    </label>
                  </td>
                  <td className="px-4 py-3 text-ink-muted">{reporte.notes || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Panel>
    </section>
  );
};

export default EnvioDetalle;
