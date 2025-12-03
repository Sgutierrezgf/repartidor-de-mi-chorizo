import Form from "../../../components/form/Form";
import { CardContainer } from "../../../components/CardContainer/CardContainer";

const Orders = () => {

  return (
 <section className="max-w-xl mx-auto px-4 py-6 pt-8">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
       Crea tu pedido
      </h2>

      <CardContainer>
        <Form setClients={() => {}} /> 
      </CardContainer>
    </section>
  )
}

export default Orders;