import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { formSchema, type FormValues } from "./models";
import { Button } from "../bottons/Button";
import { sendClientData, type FormProps  } from "../../services/ClientsApi";

const Form = ({ setClients }: FormProps ) => {
  const { control, handleSubmit, register } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {}
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "products"
  });


 const onSubmit = async (data: FormValues) => {
    const totals = {
      normal: 0,
      pepper: 0,
      spicy: 0,
      payment: false
    };

    data.products.forEach(p => {
      if (p.type === "normal") totals.normal += p.amount;
      if (p.type === "pimienta") totals.pepper += p.amount;
      if (p.type === "picante") totals.spicy += p.amount;
    });

    const apiPayload = {
      name: data.name,
      ...totals,
      payment: false
    };

    const newClient = await sendClientData(apiPayload);

    if (newClient) {
      setClients(prev => [...prev, newClient]);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 dark:text-white">
      
     
      <div className="flex flex-col gap-2">
        <label>Name</label>
        <input 
          {...register("name")} 
          className="border p-2 rounded w-full dark:bg-gray-700 dark:border-gray-600"
        />
      </div>

     
      <div className="space-y-4">
        <h3 className="font-semibold">sausage styles</h3>

        {fields.map((item, index) => (
          <div 
            key={item.id} 
            className="flex items-center gap-4 bg-gray-50 p-3 rounded dark:bg-gray-700"
          >
            
           
            <select
              {...register(`products.${index}.type`)}
              className="border p-2 rounded dark:bg-gray-700 dark:border-gray-600"
            >
              <option value="normal">Normal</option>
              <option value="pimienta">Pepper</option>
              <option value="picante">Spicy</option>
            </select>

          
            <input
              type="number"
              {...register(`products.${index}.amount`, { valueAsNumber: true })}
              className="border p-2 rounded w-20 dark:bg-gray-700 dark:border-gray-600"
            />

            
            <button 
              type="button" 
              onClick={() => remove(index)}
              className="text-red-600 font-bold"
            >
              X
            </button>

          </div>
        ))}

        <button 
          type="button"
          onClick={() => append({ type: "normal", amount: 1 })}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          + Add sausage
        </button>
      </div>

      <Button>Save</Button>
    </form>
  );
};

export default Form;