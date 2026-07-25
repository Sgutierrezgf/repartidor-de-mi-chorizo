import { supabase } from "../utilities";

export interface VentaDirecta {
  id?: number;
  created_at?: string;
  name: string;
  normal: number;
  pepper: number;
  spicy: number;
  payment: boolean;
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
): Promise<{ error: string | null }> => {
  const { error } = await supabase.from("delivery_clients").insert([
    {
      name: venta.name,
      normal: venta.normal,
      pepper: venta.pepper,
      spicy: venta.spicy,
      payment: venta.payment ?? false,
    },
  ]);

  return { error: error?.message ?? null };
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
