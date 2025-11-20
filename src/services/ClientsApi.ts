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
  const { data, error } = await supabase
    .from("delivery_clients")
    .insert([
      {
        name: dataDelivery.name,
        normal: dataDelivery.normal,
        pepper: dataDelivery.pepper,
        spicy: dataDelivery.spicy,
        payment: false,
      },
    ])
    .select()  // ← Esto te devuelve el id creado
    .single();

  if (error) {
    console.error(error);
    return null;
  }

  console.log("Insertado:", data);
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