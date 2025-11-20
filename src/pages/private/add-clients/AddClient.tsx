import { useEffect, useState } from "react";
import { CardContainer } from "../../../components/CardContainer/CardContainer";
import Form from "../../../components/form/Form";
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
 <section className="max-w-6xl mx-auto px-4 py-6 pt-8 grid gap-10 lg:grid-cols-2">

  {/* Formulario */}
  <div>
    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Registrar Cliente</h2>
    <CardContainer>
      <Form setClients={setClients} />
    </CardContainer>
  </div>

  {/* Tabla */}
  <div>
    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Lista de Clientes</h2>
    <CardContainer>
      <TableClients clients={clients} setClients={setClients} />
    </CardContainer>
  </div>

</section>

  );
};

export default AddClient;
