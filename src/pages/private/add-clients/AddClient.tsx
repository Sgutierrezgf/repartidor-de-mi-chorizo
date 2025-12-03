import { useEffect, useState } from "react";
import { CardContainer } from "../../../components/CardContainer/CardContainer";
// import Form from "../../../components/form/Form";
import { TableClients } from "../../../components/tableClients/TableClients";
import { getClientsData, type ClientRow } from "../../../services/ClientsApi";

const AddClient = () => {
   const [clients, setClients] = useState<ClientRow[]>([]);

  useEffect(() => {
    (async () => {
      const data = await getClientsData();
      if (data) setClients(data);
    })();
  }, []);

  return (
<section className="max-w-6xl mx-auto px-4 py-6 pt-8">

      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        Lista de Pedidos
      </h2>

      <CardContainer>
        <TableClients clients={clients} setClients={setClients} />
      </CardContainer>

    </section>

  );
};

export default AddClient;
