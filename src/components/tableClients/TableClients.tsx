import { useEffect, useState } from "react";
import { getClientsData, type clientsDelivery } from "../../services/ClientsApi";
// import { getClientsData } from "../../services/ClientsApi";

export const TableClients = () => {


  const [clients, setClients] = useState<clientsDelivery[]>([]);

  useEffect(() => {
    const fetchClients = async () => {
      const dataClients = await getClientsData()
      if(dataClients){
        setClients(dataClients)
      }
    }
    fetchClients()
  }, [])

  console.log(clients)

  const onTogglePaid = (id: number) => {
    setClients((prev) =>
      prev.map((client) =>
        client.id === id ? { ...client, payment: !client.payment } : client
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
            <th className="px-4 py-3 text-left">normal</th>
            <th className="px-4 py-3 text-left">pepper</th>
            <th className="px-4 py-3 text-left">spicy</th>
            <th className="px-4 py-3 text-center">paid</th>
          </tr>
        </thead>

        {/* Cuerpo */}
        <tbody className="text-gray-600">
          {clients.map((client) => (
            <tr
              key={client.id}
              className="hover:bg-gray-50 transition-colors border-t"
            >
              <td className="px-4 py-3">{client.name}</td>
              <td className="px-4 py-3">{client.normal}</td>
              <td className="px-4 py-3">{client.pepper}</td>
              <td className="px-4 py-3">{client.spicy}</td>

              {/* Campo PAGÓ */}
              <td className="px-4 py-3 text-center">
                <input
                  type="checkbox"
                  checked={client.payment}
                  onChange={() => onTogglePaid(client.id!)}
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
