import { useEffect } from "react";
import {
  getClientsData,
  updateClientPayment,
  type TableClientsProps,
} from "../../services/ClientsApi";

export const TableClients = ({ clients, setClients }: TableClientsProps) => {
  useEffect(() => {
    (async () => {
      const data = await getClientsData();
      if (data) setClients(data);
    })();
  }, [setClients]);

  const onTogglePaid = async (id: number) => {
    setClients((prev) =>
      prev.map((c) => (c.id === id ? { ...c, payment: !c.payment } : c))
    );

    const current = clients.find((c) => c.id === id);
    const newPaid = !current?.payment;

    const success = await updateClientPayment(id, newPaid);


    if (!success) {
      // revertir
      setClients((prev) =>
        prev.map((c) => (c.id === id ? { ...c, payment: !newPaid } : c))
      );
    }
  };

  // const totalNormal = clients.reduce((sum, client) => sum + client.normal, 0);
  // const totalPepper = clients.reduce((sum, client) => sum + client.pepper, 0);
  // const totalSpicy = clients.reduce((sum, client) => sum + client.spicy, 0);  
  // const totalPaid = totalNormal + totalPepper + totalSpicy;
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
          {clients.length === 0  &&  (
            <tr>
              <td colSpan={5} className="px-4 py-3 text-center text-gray-400">
                No data
              </td>
            </tr>
          )}
          {clients
          .filter((c)=> !c.payment)
          .map((client) => (
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
                  onChange={() => onTogglePaid(client.id)}
                  className="w-5 h-5 accent-green-600 cursor-pointer"
                />
              </td>
            </tr>
          ))}
          {/* <td className="px-4 py-3">Total</td>
          <td className="px-4 py-3">{totalNormal}</td>
          <td className="px-4 py-3">{totalPepper}</td>
          <td className="px-4 py-3">{totalSpicy}</td>
          <td className="px-4 py-3">{totalPaid}</td> */}
        </tbody>
      </table>

    </div>
  );
};
