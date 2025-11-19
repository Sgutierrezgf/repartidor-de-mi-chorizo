import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { formSchema, type FormValues } from "./models";
import { Button } from "../bottons/Button";
import { sendClientData } from "../../services/ClientsApi";

const Form = () => {
  const { control, handleSubmit, register } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {}
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "products"
  });


  const onSubmit = (data: FormValues) => {

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
    ...totals
  };

  sendClientData(apiPayload);
    
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      
     
      <div>
        <label>Nombre</label>
        <input 
          {...register("name")} 
          className="border p-2 rounded w-full"
        />
      </div>

     
      <div className="space-y-4">
        <h3 className="font-semibold">Productos comprados</h3>

        {fields.map((item, index) => (
          <div 
            key={item.id} 
            className="flex items-center gap-4 bg-gray-50 p-3 rounded"
          >
            
           
            <select
              {...register(`products.${index}.type`)}
              className="border p-2 rounded"
            >
              <option value="normal">Normal</option>
              <option value="pimienta">Pimienta</option>
              <option value="picante">Picante</option>
            </select>

          
            <input
              type="number"
              {...register(`products.${index}.amount`, { valueAsNumber: true })}
              className="border p-2 rounded w-20"
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
          + Agregar tipo
        </button>
      </div>

      <Button>Guardar</Button>
    </form>
  );
};

export default Form;