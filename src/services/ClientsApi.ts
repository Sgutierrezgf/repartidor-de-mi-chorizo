import type { FormValues } from "../components/form/models";

export const sendClientData = async (data:FormValues) =>{
    await fetch("https://script.google.com/macros/s/AKfycbyaG5ADweutqTFSsJPzjr-unETLHAr0YgE_sF4mqInGfTIcai6QszCv6IyvO_YTlo4B-w/exec", {
      method: "POST",
      mode: "no-cors",
      body: JSON.stringify({
        name: data.name,
        amount: data.amount,
        type: data.type,
      }),
      headers: {
        "Content-Type": "application/json",
    },
    });  
}
