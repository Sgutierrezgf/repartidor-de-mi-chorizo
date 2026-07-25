import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Panel } from "../../../components/ui/Panel";
import { StatusPill } from "../../../components/ui/StatusPill";
import { Button } from "../../../components/bottons/Button";
import {
  createVenta,
  getVentas,
  updateVentaPago,
  type VentaDirecta,
} from "../../../services/ventasApi";

const ventaSchema = z.object({
  name: z.string().min(2, "Escribe el nombre"),
  products: z
    .array(
      z.object({
        type: z.enum(["normal", "pimienta", "picante"]),
        amount: z.number().min(1, "Mínimo 1"),
      })
    )
    .min(1, "Agrega al menos un tipo"),
  payment: z.boolean(),
});

type VentaForm = z.infer<typeof ventaSchema>;

const totalPackages = (v: VentaDirecta) => v.normal + v.pepper + v.spicy;

const Ventas = () => {
  const [ventas, setVentas] = useState<VentaDirecta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<VentaForm>({
    resolver: zodResolver(ventaSchema),
    defaultValues: {
      name: "",
      products: [{ type: "normal", amount: 1 }],
      payment: false,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "products",
  });

  const load = async () => {
    setLoading(true);
    setError(null);
    const data = await getVentas();
    if (data) setVentas(data);
    else setError("No se pudieron cargar las ventas.");
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const onSubmit = async (data: VentaForm) => {
    setSaving(true);
    setError(null);

    const totals = { normal: 0, pepper: 0, spicy: 0 };
    data.products.forEach((p) => {
      if (p.type === "normal") totals.normal += p.amount;
      if (p.type === "pimienta") totals.pepper += p.amount;
      if (p.type === "picante") totals.spicy += p.amount;
    });

    const { error: createError } = await createVenta({
      name: data.name,
      ...totals,
      payment: data.payment,
    });

    setSaving(false);

    if (createError) {
      setError(createError);
      return;
    }

    reset({
      name: "",
      products: [{ type: "normal", amount: 1 }],
      payment: false,
    });
    await load();
  };

  const onTogglePaid = async (venta: VentaDirecta) => {
    if (!venta.id) return;
    const next = !venta.payment;
    setUpdatingId(venta.id);
    setVentas((prev) =>
      prev.map((v) => (v.id === venta.id ? { ...v, payment: next } : v))
    );

    const { error: updateError } = await updateVentaPago(venta.id, next);
    if (updateError) {
      setError(updateError);
      setVentas((prev) =>
        prev.map((v) =>
          v.id === venta.id ? { ...v, payment: venta.payment } : v
        )
      );
    }
    setUpdatingId(null);
  };

  const unpaid = ventas.filter((v) => !v.payment);

  return (
    <section className="space-y-8">
      <header className="space-y-1">
        <h1 className="font-display text-3xl font-bold">Ventas</h1>
        <p className="text-ink-muted">
          Registro de paquetes vendidos a personas (ej. Carlos — 3 paquetes).
        </p>
      </header>

      {error && (
        <p className="rounded-md border border-blood/30 bg-blood/10 px-3 py-2 text-sm text-blood" role="alert">
          {error}
        </p>
      )}

      <Panel>
        <h2 className="font-display text-xl font-bold">Nueva venta</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
          <div>
            <label className="mb-1 block text-sm font-semibold">Persona</label>
            <input
              {...register("name")}
              className="w-full rounded-md border border-line bg-paper px-3 py-2 outline-none focus:border-blood"
              placeholder="Nombre"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-blood">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-3">
            <p className="text-sm font-semibold">Paquetes</p>
            {fields.map((field, index) => (
              <div key={field.id} className="flex flex-wrap items-center gap-2">
                <select
                  {...register(`products.${index}.type`)}
                  className="rounded-md border border-line bg-paper px-3 py-2"
                >
                  <option value="normal">Normal</option>
                  <option value="pimienta">Pimienta</option>
                  <option value="picante">Picante</option>
                </select>
                <input
                  type="number"
                  min={1}
                  {...register(`products.${index}.amount`, { valueAsNumber: true })}
                  className="w-24 rounded-md border border-line bg-paper px-3 py-2"
                />
                <button
                  type="button"
                  className="text-sm font-semibold text-blood disabled:opacity-40"
                  disabled={fields.length === 1}
                  onClick={() => remove(index)}
                >
                  Quitar
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
              + Agregar tipo
            </Button>
          </div>

          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" {...register("payment")} className="size-4 accent-ok" />
            Ya pagó
          </label>

          <Button type="submit" disabled={saving}>
            {saving ? "Guardando…" : "Guardar venta"}
          </Button>
        </form>
      </Panel>

      <div className="flex flex-wrap gap-2 text-sm">
        <StatusPill tone="neutral">{`${ventas.length} ventas`}</StatusPill>
        <StatusPill tone={unpaid.length ? "warn" : "ok"}>
          {`${unpaid.length} por cobrar`}
        </StatusPill>
      </div>

      <Panel className="overflow-x-auto p-0 sm:p-0">
        {loading ? (
          <p className="p-5 text-ink-muted">Cargando ventas…</p>
        ) : ventas.length === 0 ? (
          <p className="p-5 text-ink-muted">Todavía no hay ventas registradas.</p>
        ) : (
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead className="border-b border-line bg-paper-deep/50 text-ink-muted">
              <tr>
                <th className="px-4 py-3 font-semibold">Persona</th>
                <th className="px-4 py-3 font-semibold">Normal</th>
                <th className="px-4 py-3 font-semibold">Pimienta</th>
                <th className="px-4 py-3 font-semibold">Picante</th>
                <th className="px-4 py-3 font-semibold">Total</th>
                <th className="px-4 py-3 font-semibold">Pago</th>
              </tr>
            </thead>
            <tbody>
              {ventas.map((venta) => (
                <tr key={venta.id} className="border-t border-line">
                  <td className="px-4 py-3 font-medium">{venta.name}</td>
                  <td className="px-4 py-3">{venta.normal}</td>
                  <td className="px-4 py-3">{venta.pepper}</td>
                  <td className="px-4 py-3">{venta.spicy}</td>
                  <td className="px-4 py-3">{totalPackages(venta)}</td>
                  <td className="px-4 py-3">
                    <label className="inline-flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={venta.payment}
                        disabled={updatingId === venta.id}
                        onChange={() => onTogglePaid(venta)}
                        className="size-4 accent-ok"
                      />
                      <StatusPill tone={venta.payment ? "ok" : "warn"}>
                        {venta.payment ? "Pagado" : "Debe"}
                      </StatusPill>
                    </label>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Panel>
    </section>
  );
};

export default Ventas;
