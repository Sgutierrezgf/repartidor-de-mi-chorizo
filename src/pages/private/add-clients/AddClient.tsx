import { useEffect, useState } from "react";
import { CardContainer } from "../../../components/CardContainer/CardContainer";
import { TableClients } from "../../../components/tableClients/TableClients";
import { 
  getClientsData, 
  type ClientRow,
  getActiveCycle,
  createCycle,
  closeCycle
} from "../../../services/ClientsApi";
import { useTranslation } from "react-i18next";
import type { ActiveCycle } from "../../../types/cycles";


const AddClient = () => {
  const { t } = useTranslation();
  const [clients, setClients] = useState<ClientRow[]>([]);
  const [activeCycle, setActiveCycle] = useState<ActiveCycle | null>(null);

  useEffect(() => {
    (async () => {
      const data = await getClientsData();
      if (data) setClients(data);

      const cycle = await getActiveCycle();
      setActiveCycle(cycle);
    })();
  }, []);

  const handleOpenOrders = async () => {
    const cycle = await createCycle();
    setActiveCycle(cycle);
  };

  const handleCloseOrders = async () => {
    if (!activeCycle) return;
    await closeCycle(activeCycle.id);
    setActiveCycle(null);
  };

  return (
    <section className="w-full px-4 py-6 pt-16 text-gray-200">

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
          {t("clients.client_list")}
        </h2>

        {/* BOTÓN DE CICLO */}
        {!activeCycle ? (
          <button
            onClick={handleOpenOrders}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl"
          >
            {t("messages.boton_order")}
          </button>
        ) : (
          <button
            onClick={handleCloseOrders}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl"
          >
            {t("messages.boton_close")}
          </button>
        )}
      </div>

      <p className="mb-6 text-sm text-gray-600 dark:text-gray-400">
        {t("messages.cycle_state")}:{" "}
        <span className={`font-semibold ${activeCycle ? "text-green-500" : "text-red-500"}`}>
          {activeCycle ? t("messages.open") : t("messages.closed")}
        </span>
      </p>

      <CardContainer>
        <TableClients clients={clients} setClients={setClients} />
      </CardContainer>
    </section>
  );
};

export default AddClient;
