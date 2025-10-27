import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { formSchema, type FormValues } from "./models";
import CustomInput from "./components/CustomInput";

const Form = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    console.log(data);
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
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
      <button type="submit">Guardar</button>
    </form>
  );
};

export default Form;
