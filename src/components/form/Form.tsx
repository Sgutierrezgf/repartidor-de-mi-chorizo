import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { formSchema, type FormValues } from "./models";
import CustomInput from "./components/CustomInput";
import { sendClientData } from "../../services/ClientsApi";
import { Button } from "../bottons/Button";

const Form = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    if(data){
      sendClientData(data);
        alert("Data sent successfully!");
    } else {
     alert("Data dont sent !");
    }
  }
    
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <CustomInput
        name="name"
        control={control}
        label="name"
        type="text"
        error={errors.name}
      />
      <CustomInput
        name="amount"
        control={control}
        label="amount"
        type="number"
        error={errors.amount}
      />
      <CustomInput
        name="type"
        control={control}
        label="type"
        type="text"
        error={errors.type}
      />
      <Button>Guardar</Button>
    </form>
  );
};

export default Form;
