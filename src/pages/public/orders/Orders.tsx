import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link } from "react-router-dom";
import pepper from "../../../assets/img/pepper.jpeg";
import spicy from "../../../assets/img/spicy.jpeg";
import normal from "../../../assets/img/normal.jpeg";
import { Panel } from "../../../components/ui/Panel";
import { Button } from "../../../components/bottons/Button";
import {
  createPedidoPublico,
  getActiveCycle,
} from "../../../services/ventasApi";
import type { ActiveCycle } from "../../../types/cycles";

const pedidoSchema = z.object({
  name: z.string().min(2, "Escribe tu nombre"),
  products: z
    .array(
      z.object({
        type: z.enum(["normal", "pimienta", "picante"]),
        amount: z.number().min(1),
      })
    )
    .min(1, "Agrega al menos un tipo"),
});

type PedidoForm = z.infer<typeof pedidoSchema>;

const productTypes = [
  { id: "normal", label: "Normal", img: normal },
  { id: "pimienta", label: "Pimienta", img: pepper },
  { id: "picante", label: "Picante", img: spicy },
] as const;

const Orders = () => {
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

    setMessage("Pedido guardado. ¡Gracias!");
    reset({ name: "", products: [{ type: "normal", amount: 1 }] });
  };

  return (
    <section className="mx-auto min-h-screen max-w-2xl px-4 py-10">
      <div className="mb-6 flex items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-bold">Hacer pedido</h1>
          <p className="text-sm text-ink-muted">Elige tus paquetes de chorizo</p>
        </div>
        <Link to="/login" className="text-sm font-semibold text-blood hover:underline">
          Entrar
        </Link>
      </div>

      {loading ? (
        <p className="text-ink-muted">Cargando…</p>
      ) : !cycle ? (
        <Panel>
          <p className="text-center text-warn">
            Todavía no hay pedidos abiertos. Vuelve más tarde.
          </p>
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
                <label className="mb-1 block text-sm font-semibold">Tu nombre</label>
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
                    <option value="normal">Normal</option>
                    <option value="pimienta">Pimienta</option>
                    <option value="picante">Picante</option>
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
                    Quitar
                  </button>
                </div>
              ))}

              <Button
                type="button"
                variant="ghost"
                onClick={() => append({ type: "normal", amount: 1 })}
              >
                + Agregar tipo
              </Button>

              <Button type="submit" className="w-full" disabled={saving}>
                {saving ? "Enviando…" : "Enviar pedido"}
              </Button>
            </form>
          </Panel>
        </>
      )}
    </section>
  );
};

export default Orders;
