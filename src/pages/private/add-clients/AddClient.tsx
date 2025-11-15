import { CardContainer } from "../../../components/CardContainer/CardContainer";
import Form from "../../../components/form/Form";
import { TableClients } from "../../../components/tableClients/TableClients";

const AddClient = () => {
  return (
    <div className="flex space-y-6 mb-8">
      <CardContainer className="w-full max-w-md">
        <Form />
      </CardContainer>
      <CardContainer>
        <TableClients />
      </CardContainer>
    </div>
  );
};

export default AddClient;
