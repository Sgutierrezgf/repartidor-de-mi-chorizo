
import type { ActiveCycle, CycleSummary, DeliveryCycle } from "../types/cycles";
import { supabase } from "../utilities";

export interface ClientInsert  {
  name: string;
  normal: number;
  pepper: number;
  spicy: number;
  payment: boolean
}

export interface ClientRow {
  id: number;            
  created_at: string;
  name: string;
  normal: number;
  pepper: number;
  spicy: number;
  payment: boolean;
}
export interface TableClientsProps {
  clients: ClientRow[];
  setClients: React.Dispatch<React.SetStateAction<ClientRow[]>>;
}

export interface FormProps {
  setClients: React.Dispatch<React.SetStateAction<ClientRow[]>>;
}


export const sendClientData = async (dataDelivery: ClientInsert) => {
  const activeCycle = await getActiveCycle();
  if (!activeCycle) {
    console.warn("No hay ciclo activo → no se permiten pedidos");
    return null;
  }

  const { data, error } = await supabase
    .from("delivery_clients")
    .insert([{
      name: dataDelivery.name,
      normal: dataDelivery.normal,
      pepper: dataDelivery.pepper,
      spicy: dataDelivery.spicy,
      payment: false,
      cycle_id: activeCycle.id
    }])
    .select()
    .single();

  if (error) return null;

  return data as ClientRow;
};
export const getClientsData = async (): Promise<ClientRow[] | null> => {
  const { data, error } = await supabase
    .from("delivery_clients")
    .select("*");

  if (error) {
    console.error(error);
    return null;
  }

  return data as ClientRow[];
};

export const updateClientPayment = async (id: number, payment: boolean) => {
  const { error } = await supabase
    .from("delivery_clients")
    .update({ payment })
    .eq("id", id);

  if (error) {
    console.error("Error updating payment:", error);
    return false;
  }

  return true;
};


export const getActiveCycle = async  (): Promise<ActiveCycle | null> => {
  const { data, error } = await supabase
    .from("delivery_cycles")
    .select("*")
    .eq("is_open", true)
    .order("id", { ascending: false })
    .limit(1)
    .maybeSingle();

   if (error) {
    // Si es 406 ignoramos el error y retornamos null
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

  if (error) return null;
  return data;
};


export const closeCycle = async (id: number) => {
  const { error } = await supabase
    .from("delivery_cycles")
    .update({ is_open: false })
    .eq("id", id);

  return !error;
};

export const getCyclesSummary = async (): Promise<CycleSummary[]> => {
  const { data, error } = await supabase
    .from("delivery_cycles")
    .select(`
      id,
      created_at,
      is_open,
      delivery_clients (
        normal,
        pepper,
        spicy,
        payment
      )
    `)
    .order("id", { ascending: false });

  if (error || !data) return [];

  return (data as DeliveryCycle[]).map((cycle) => {
    const clients = cycle.delivery_clients;

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