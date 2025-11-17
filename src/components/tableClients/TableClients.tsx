import { useState } from "react";
import { getClientsData } from "../../services/ClientsApi";

export const TableClients = () => {
  const [clients, setClients] = useState([
    { id: 1, nombre: "Carlos Méndez", type_amount: "picantes 2",  pagado: true },
    { id: 2, nombre: "Ana López", type_amount: "normales 2",pagado: false },
    { id: 3, nombre: "Luis Torres", type_amount: "picantes 2", pagado: true },
    { id: 4, nombre: "Andrea Ruiz", type_amount: "normales 2", pagado: false },
    { id: 5, nombre: "Miguel Castro", type_amount: "picantes 2",  pagado: false },
  ]);

  console.log("Clientes en TableClients:", getClientsData());

  const onTogglePaid = (id: number) => {
    setClients((prev) =>
      prev.map((client) =>
        client.id === id ? { ...client, pagado: !client.pagado } : client
      )
    );
  };

  return (
    <div className="overflow-x-auto mt-6 shadow-lg rounded-xl border border-gray-200 bg-white">
      <table className="w-full table-auto">
        
        {/* Encabezado */}
        <thead className="bg-gray-100 text-gray-700 uppercase text-sm">
          <tr>
            <th className="px-4 py-3 text-left">Name</th>
            <th className="px-4 py-3 text-left">Type x Amount</th>
            <th className="px-4 py-3 text-center">Pagó</th>
          </tr>
        </thead>

        {/* Cuerpo */}
        <tbody className="text-gray-600">
          {clients.map((client) => (
            <tr
              key={client.id}
              className="hover:bg-gray-50 transition-colors border-t"
            >
              <td className="px-4 py-3">{client.nombre}</td>
              <td className="px-4 py-3">{client.type_amount}</td>

              {/* Campo PAGÓ */}
              <td className="px-4 py-3 text-center">
                <input
                  type="checkbox"
                  checked={client.pagado}
                  onChange={() => onTogglePaid(client.id)}
                  className="w-5 h-5 accent-green-600 cursor-pointer"
                />
              </td>
            </tr>
          ))}
        </tbody>

      </table>
    </div>
  );
};
