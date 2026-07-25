import { useEffect, useMemo, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { Link } from "react-router-dom";
import pepper from "../../../assets/img/pepper.jpeg";
import spicy from "../../../assets/img/spicy.jpeg";
import normal from "../../../assets/img/normal.jpeg";
import { Panel } from "../../../components/ui/Panel";
import { Button } from "../../../components/bottons/Button";
import { PrefsControls } from "../../../components/prefs/PrefsControls";
import {
  createPedidoPublico,
  getActiveCycle,
} from "../../../services/ventasApi";
import type { ActiveCycle } from "../../../types/cycles";

const productImages = [
  { id: "normal", img: normal },
  { id: "pimienta", img: pepper },
  { id: "picante", img: spicy },
] as const;

const Orders = () => {
  const { t } = useTranslation();

  const pedidoSchema = useMemo(
    () =>
      z.object({
        name: z.string().min(2, t("pedidos.nameRequired")),
        products: z
          .array(
            z.object({
              type: z.enum(["normal", "pimienta", "picante"]),
              amount: z.number().min(1, t("ventas.minAmount")),
            })
          )
          .min(1, t("pedidos.minProducts")),
      }),
    [t]
  );

  type PedidoForm = z.infer<typeof pedidoSchema>;

  const productTypes = useMemo(
    () =>
      productImages.map((p) => ({
        ...p,
        label:
          p.id === "normal"
            ? t("common.normal")
            : p.id === "pimienta"
              ? t("common.pepper")
              : t("common.spicy"),
      })),
    [t]
  );

  const [cycle, setCycle] = useState<ActiveCycle | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PedidoForm>({
    resolver: zodResolver(pedidoSchema),
    defaultValues: {
      name: "",
      products: [{ type: "normal", amount: 1 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "products",
  });

  useEffect(() => {
    getActiveCycle()
      .then(setCycle)
      .finally(() => setLoading(false));
  }, []);

  const onSubmit = async (data: PedidoForm) => {
    setSaving(true);
    setMessage(null);
    setError(null);

    const totals = { normal: 0, pepper: 0, spicy: 0 };
    data.products.forEach((p) => {
      if (p.type === "normal") totals.normal += p.amount;
      if (p.type === "pimienta") totals.pepper += p.amount;
      if (p.type === "picante") totals.spicy += p.amount;
    });

    const { error: createError } = await createPedidoPublico({
      name: data.name,
      ...totals,
    });

    setSaving(false);

    if (createError) {
      setError(createError);
      return;
    }

    setMessage(t("pedidos.saved"));
    reset({ name: "", products: [{ type: "normal", amount: 1 }] });
  };

  return (
    <section className="mx-auto min-h-screen max-w-2xl px-4 py-10">
      <div className="mb-6 flex items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-bold">{t("pedidos.title")}</h1>
          <p className="text-sm text-ink-muted">{t("pedidos.subtitle")}</p>
        </div>
        <div className="flex items-center gap-3">
          <PrefsControls />
          <Link to="/login" className="text-sm font-semibold text-blood hover:underline">
            {t("nav.login")}
          </Link>
        </div>
      </div>

      {loading ? (
        <p className="text-ink-muted">{t("common.loading")}</p>
      ) : !cycle ? (
        <Panel>
          <p className="text-center text-warn">{t("pedidos.closed")}</p>
        </Panel>
      ) : (
        <>
          <div className="mb-6 grid grid-cols-3 gap-3">
            {productTypes.map((p) => (
              <div
                key={p.id}
                className="flex flex-col items-center rounded-lg border border-line bg-surface p-3 text-center"
              >
                <img
                  src={p.img}
                  alt={p.label}
                  className="mb-2 h-16 w-16 rounded-full object-cover ring-1 ring-line"
                />
                <p className="text-sm font-semibold">{p.label}</p>
              </div>
            ))}
          </div>

          <Panel>
            {message && (
              <p className="mb-4 rounded-md bg-ok/15 px-3 py-2 text-sm text-ok">
                {message}
              </p>
            )}
            {error && (
              <p className="mb-4 rounded-md bg-blood/10 px-3 py-2 text-sm text-blood">
                {error}
              </p>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-semibold">
                  {t("pedidos.yourName")}
                </label>
                <input
                  {...register("name")}
                  className="w-full rounded-md border border-line bg-paper px-3 py-2"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-blood">{errors.name.message}</p>
                )}
              </div>

              {fields.map((field, index) => (
                <div key={field.id} className="flex flex-wrap items-center gap-2">
                  <select
                    {...register(`products.${index}.type`)}
                    className="rounded-md border border-line bg-paper px-3 py-2"
                  >
                    <option value="normal">{t("common.normal")}</option>
                    <option value="pimienta">{t("common.pepper")}</option>
                    <option value="picante">{t("common.spicy")}</option>
                  </select>
                  <input
                    type="number"
                    min={1}
                    {...register(`products.${index}.amount`, {
                      valueAsNumber: true,
                    })}
                    className="w-24 rounded-md border border-line bg-paper px-3 py-2"
                  />
                  <button
                    type="button"
                    className="text-sm font-semibold text-blood disabled:opacity-40"
                    disabled={fields.length === 1}
                    onClick={() => remove(index)}
                  >
                    {t("common.remove")}
                  </button>
                </div>
              ))}

              {errors.products && (
                <p className="text-sm text-blood">
                  {errors.products.message ?? errors.products.root?.message}
                </p>
              )}

              <Button
                type="button"
                variant="ghost"
                onClick={() => append({ type: "normal", amount: 1 })}
              >
                {t("common.addType")}
              </Button>

              <Button type="submit" className="w-full" disabled={saving}>
                {saving ? t("pedidos.submitting") : t("pedidos.submit")}
              </Button>
            </form>
          </Panel>
        </>
      )}
    </section>
  );
};

export default Orders;
