import { CardContainer } from "../../../components/CardContainer/CardContainer";
import Form from "../../../components/form/Form";
import { TableClients } from "../../../components/tableClients/TableClients";

const AddClient = () => {
  return (
    <section className="max-w-6xl mx-auto px-4 py-6 pt-8 space-y-10">
      
      {/* Formulario */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Registrar Cliente</h2>
        <CardContainer>
          <Form />
        </CardContainer>
      </div>

      {/* Tabla */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Lista de Clientes</h2>
        <CardContainer>
          <TableClients />
        </CardContainer>
      </div>

    </section>
  );
};

export default AddClient;
