import type { FormValues } from "../components/form/models";

const URLGOOGLESCRIPT = import.meta.env.VITE_URL_API;

export const sendClientData = async (data: FormValues) => {
  const response = await fetch(
    URLGOOGLESCRIPT,
    {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  const result = await response.json();
  console.log("Respuesta de Google Apps Script:", result);
};

export const getClientsData = async () => {
  const response = await fetch(
    URLGOOGLESCRIPT,
    {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json"
      }
    }
  );

  const data = await response.json();
  console.log("Datos recibidos de Google Sheets:", data);

  return data;
};