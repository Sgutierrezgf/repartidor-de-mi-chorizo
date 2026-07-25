import { supabase } from "../utilities";

export interface Envio {
  id: number;
  created_at: string;
  person_name: string;
  normal: number;
  pepper: number;
  spicy: number;
  notes: string | null;
  closed: boolean;
}

export interface ReporteVenta {
  id: number;
  created_at: string;
  shipment_id: number;
  quantity: number;
  paid: boolean;
  sold_at: string;
  notes: string | null;
}

export type EnvioInput = {
  person_name: string;
  normal: number;
  pepper: number;
  spicy: number;
  notes?: string;
};

export type ReporteInput = {
  shipment_id: number;
  quantity: number;
  paid?: boolean;
  sold_at: string;
  notes?: string;
};

export const totalEnviado = (envio: Pick<Envio, "normal" | "pepper" | "spicy">) =>
  envio.normal + envio.pepper + envio.spicy;

export const getEnvios = async (): Promise<Envio[] | null> => {
  const { data, error } = await supabase
    .from("shipments")
    .select()
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return null;
  }

  return data;
};

export const getEnvio = async (id: number): Promise<Envio | null> => {
  const { data, error } = await supabase
    .from("shipments")
    .select()
    .eq("id", id)
    .single();

  if (error) {
    console.error(error);
    return null;
  }

  return data;
};

export const createEnvio = async (
  input: EnvioInput
): Promise<{ data: Envio | null; error: string | null }> => {
  const { data, error } = await supabase
    .from("shipments")
    .insert([
      {
        person_name: input.person_name,
        normal: input.normal,
        pepper: input.pepper,
        spicy: input.spicy,
        notes: input.notes || null,
        closed: false,
      },
    ])
    .select()
    .single();

  return { data, error: error?.message ?? null };
};

export const setEnvioClosed = async (
  id: number,
  closed: boolean
): Promise<{ error: string | null }> => {
  const { error } = await supabase.from("shipments").update({ closed }).eq("id", id);
  return { error: error?.message ?? null };
};

export const getReportes = async (
  shipmentId: number
): Promise<ReporteVenta[] | null> => {
  const { data, error } = await supabase
    .from("shipment_sales")
    .select()
    .eq("shipment_id", shipmentId)
    .order("sold_at", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return null;
  }

  return data;
};

export const getReportesByShipmentIds = async (
  shipmentIds: number[]
): Promise<ReporteVenta[] | null> => {
  if (shipmentIds.length === 0) return [];

  const { data, error } = await supabase
    .from("shipment_sales")
    .select()
    .in("shipment_id", shipmentIds);

  if (error) {
    console.error(error);
    return null;
  }

  return data;
};

export const createReporte = async (
  input: ReporteInput
): Promise<{ error: string | null }> => {
  const { error } = await supabase.from("shipment_sales").insert([
    {
      shipment_id: input.shipment_id,
      quantity: input.quantity,
      paid: input.paid ?? false,
      sold_at: input.sold_at,
      notes: input.notes || null,
    },
  ]);

  return { error: error?.message ?? null };
};

export const updateReportePago = async (
  id: number,
  paid: boolean
): Promise<{ error: string | null }> => {
  const { error } = await supabase
    .from("shipment_sales")
    .update({ paid })
    .eq("id", id);

  return { error: error?.message ?? null };
};

export const summarizeReportes = (reportes: ReporteVenta[]) => {
  const vendidos = reportes.reduce((sum, r) => sum + r.quantity, 0);
  const porCobrar = reportes
    .filter((r) => !r.paid)
    .reduce((sum, r) => sum + r.quantity, 0);
  const cobrados = reportes
    .filter((r) => r.paid)
    .reduce((sum, r) => sum + r.quantity, 0);

  return { vendidos, porCobrar, cobrados };
};
