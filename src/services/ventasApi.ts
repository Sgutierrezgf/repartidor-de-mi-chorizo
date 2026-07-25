import { supabase } from "../utilities";
import type { ActiveCycle, CycleSummary, DeliveryCycle } from "../types/cycles";

export interface VentaDirecta {
  id?: number;
  created_at?: string;
  name: string;
  normal: number;
  pepper: number;
  spicy: number;
  payment: boolean;
  cycle_id?: number | null;
}

export const getVentas = async (): Promise<VentaDirecta[] | null> => {
  const { data, error } = await supabase
    .from("delivery_clients")
    .select()
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return null;
  }

  return data;
};

export const createVenta = async (
  venta: VentaDirecta
): Promise<{ data: VentaDirecta | null; error: string | null }> => {
  const activeCycle = await getActiveCycle();

  const { data, error } = await supabase
    .from("delivery_clients")
    .insert([
      {
        name: venta.name,
        normal: venta.normal,
        pepper: venta.pepper,
        spicy: venta.spicy,
        payment: venta.payment ?? false,
        cycle_id: activeCycle?.id ?? null,
      },
    ])
    .select()
    .single();

  return { data, error: error?.message ?? null };
};

/** Public customer order — only allowed while a cycle is open. */
export const createPedidoPublico = async (
  venta: Omit<VentaDirecta, "payment" | "cycle_id">
): Promise<{ data: VentaDirecta | null; error: string | null }> => {
  const activeCycle = await getActiveCycle();
  if (!activeCycle) {
    return { data: null, error: "Los pedidos están cerrados ahora." };
  }

  const { data, error } = await supabase
    .from("delivery_clients")
    .insert([
      {
        name: venta.name,
        normal: venta.normal,
        pepper: venta.pepper,
        spicy: venta.spicy,
        payment: false,
        cycle_id: activeCycle.id,
      },
    ])
    .select()
    .single();

  return { data, error: error?.message ?? null };
};

export const updateVentaPago = async (
  id: number,
  payment: boolean
): Promise<{ error: string | null }> => {
  const { error } = await supabase
    .from("delivery_clients")
    .update({ payment })
    .eq("id", id);

  return { error: error?.message ?? null };
};

export const getActiveCycle = async (): Promise<ActiveCycle | null> => {
  const { data, error } = await supabase
    .from("delivery_cycles")
    .select("*")
    .eq("is_open", true)
    .order("id", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    if (String(error.code) === "406") return null;
    console.error("Error getActiveCycle:", error);
    return null;
  }

  return data;
};

export const createCycle = async (): Promise<ActiveCycle | null> => {
  const { data, error } = await supabase
    .from("delivery_cycles")
    .insert([{ is_open: true }])
    .select()
    .single();

  if (error) {
    console.error(error);
    return null;
  }

  return data;
};

export const closeCycle = async (id: number): Promise<boolean> => {
  const { error } = await supabase
    .from("delivery_cycles")
    .update({ is_open: false })
    .eq("id", id);

  return !error;
};

export const getCyclesSummary = async (): Promise<CycleSummary[]> => {
  const { data, error } = await supabase
    .from("delivery_cycles")
    .select(
      `
      id,
      created_at,
      is_open,
      delivery_clients (
        normal,
        pepper,
        spicy,
        payment
      )
    `
    )
    .order("id", { ascending: false });

  if (error || !data) return [];

  return (data as DeliveryCycle[]).map((cycle) => {
    const clients = cycle.delivery_clients ?? [];
    const totalNormal = clients.reduce((sum, c) => sum + c.normal, 0);
    const totalPepper = clients.reduce((sum, c) => sum + c.pepper, 0);
    const totalSpicy = clients.reduce((sum, c) => sum + c.spicy, 0);
    const total = totalNormal + totalPepper + totalSpicy;

    return {
      id: cycle.id,
      created_at: cycle.created_at,
      is_open: cycle.is_open,
      totalClients: clients.length,
      totalNormal,
      totalPepper,
      totalSpicy,
      total,
      totalPaid: clients.filter((c) => c.payment).length,
      totalMoney: total * 20000,
    };
  });
};
