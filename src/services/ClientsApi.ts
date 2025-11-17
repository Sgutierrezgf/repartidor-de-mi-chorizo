import type { FormValues } from "../components/form/models";

const URLGOOGLESCRIPT = "https://script.google.com/macros/s/AKfycbyoBpNVR5PX2pP37Sn4prPzcJ366WcpcuNtrRbLIcEmkTMOONYtSGVMWAUYFZI9AAOlhg/exec";

export const sendClientData = async (data: FormValues) => {
  const response = await fetch(
    URLGOOGLESCRIPT,
    {
      method: "POST",
      mode: "cors",
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