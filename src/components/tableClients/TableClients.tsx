import { useEffect } from "react";
import {
  getClientsData,
  updateClientPayment,
  type TableClientsProps,
} from "../../services/ClientsApi";
import { useTranslation } from "react-i18next";

export const TableClients = ({ clients, setClients }: TableClientsProps) => {
  const { t } = useTranslation();
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

  return (
    <div className="overflow-x-auto mt-6 shadow-lg rounded-xl border border-gray-200 bg-white dark:bg-gray-800">
      <table className="w-full table-auto">
        <thead className="bg-gray-100 text-gray-700 uppercase text-sm dark:bg-gray-700 dark:text-gray-300">
          <tr>
            <th className="px-4 py-3 text-left sticky left-0 bg-gray-100 dark:bg-gray-700 z-20">
              {t("orders.name")}
            </th>
            <th className="px-4 py-3 text-left">{t("orders.normal")}</th>
            <th className="px-4 py-3 text-left">{t("orders.pepper")}</th>
            <th className="px-4 py-3 text-left">{t("orders.spicy")}</th>
            <th className="px-4 py-3 text-center">{t("orders.paid")}</th>
          </tr>
        </thead>
        <tbody className="text-gray-600 dark:text-gray-300">
          {clients
            .filter((c) => !c.payment)
            .map((client) => (
              <tr
                key={client.id}
                className="hover:bg-gray-50 transition-colors border-t dark:border-gray-700 dark:hover:bg-gray-700"
              >
                <td className="px-4 py-3 sticky left-0 bg-white dark:bg-gray-800 z-10">
                  {client.name}
                </td>

                <td className="px-4 py-3">{client.normal}</td>
                <td className="px-4 py-3">{client.pepper}</td>
                <td className="px-4 py-3">{client.spicy}</td>

                <td className="px-4 py-3 text-center">
                  <input
                    type="checkbox"
                    checked={client.payment}
                    onChange={() => onTogglePaid(client.id)}
                    className="w-5 h-5 accent-green-600 cursor-pointer dark:accent-green-400"
                  />
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};
