import Form from "../../../components/form/Form";
import { CardContainer } from "../../../components/CardContainer/CardContainer";
import pepper from "../../../assets/img/pepper.jpeg";
import spicy from "../../../assets/img/spicy.jpeg";
import normal from "../../../assets/img/normal.jpeg";
import { useTranslation } from "react-i18next";

const productTypes = [
  { id: "pepper", key: "orders.pepper", img: pepper },
  { id: "spicy", key: "orders.spicy", img: spicy },
  { id: "normal", key: "orders.normal", img: normal },
];

const Orders = () => {
  const { t } = useTranslation();
  return (
    <section className="max-w-2xl mx-auto px-4 py-8 pt-16 rounded-xl">
      <h2 className="text-3xl font-semibold text-gray-800  mb-6 text-center dark:text-gray-200">
        {t("orders.create_your_order")}
      </h2>

      
      <div className="grid grid-cols-3 gap-4 mb-8 dark:bg-gray-900 p-4 rounded-xl">
        {productTypes.map((p) => (
          <div
            key={p.id}
            className="flex flex-col items-center text-center bg-white shadow-sm rounded-xl p-3 hover:shadow-md transition dark:bg-gray-700"
          >
            <img
              src={p.img}
              alt={t(p.key)}
              className="h-20 w-20 object-cover rounded-full mb-2 ring-2 ring-gray-200 dark:ring-gray-600"
            />
            <p className="font-medium text-gray-700 dark:text-gray-200">{t(p.key)}</p>
          </div>
        ))}
      </div>

    
      <CardContainer>
        <Form setClients={() => {}} />
      </CardContainer>
    </section>
  );
};

export default Orders;
