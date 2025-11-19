import { supabase } from "../utilities";

export interface clientsDelivery {
  id?: number,
  created_at?: string,
  name: string;
  normal: number;
  pepper: number;
  spicy: number;
  payment: boolean
}
export const sendClientData = async (dataDelivery: clientsDelivery) => {
  await supabase
    .from("delivery_clients")
    .insert([
      {
      "name": dataDelivery.name,
      "normal": dataDelivery.normal,
      "pepper": dataDelivery.pepper,
      "spicy": dataDelivery.spicy,
      "payment": false
      }
    ])
    console.log(dataDelivery, 'soy el pedido')
};

export const getClientsData = async (): Promise<clientsDelivery[] | null> => {
  const { data, error } = await supabase
    .from("delivery_clients")
    .select();

  if (error) {
    console.error(error);
    return null;
  }

  return data;
};