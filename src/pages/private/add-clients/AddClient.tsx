import { useEffect, useState } from "react";
import { CardContainer } from "../../../components/CardContainer/CardContainer";
// import Form from "../../../components/form/Form";
import { TableClients } from "../../../components/tableClients/TableClients";
import { getClientsData, type ClientRow } from "../../../services/ClientsApi";
import { useTranslation } from "react-i18next";

const AddClient = () => {
  const { t } = useTranslation();
  const [clients, setClients] = useState<ClientRow[]>([]);

  useEffect(() => {
    (async () => {
      const data = await getClientsData();
      if (data) setClients(data);
    })();
  }, []);

  return (
    <section className="max-w-6xl mx-auto px-4 py-6 pt-16 dark:text-gray-200">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4 dark:text-gray-200">
        {t("clients.client_list")}
      </h2>

      <CardContainer>
        <TableClients clients={clients} setClients={setClients} />
      </CardContainer>
    </section>
  );
};

export default AddClient;
