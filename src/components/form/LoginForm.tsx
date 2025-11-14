import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";

import CustomInput from "./components/CustomInput";

import { useNavigate } from "react-router-dom";
import { useGlobalContext } from "../../context/global.context";
import { supabase } from "../../utilities";
import { type LoginFormValues, loginFormSchema } from "./models";


export const LoginForm = () => {
  const navigate = useNavigate();
  const { setAuth } = useGlobalContext();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
  });

  const onSubmit: SubmitHandler<LoginFormValues> = async (data) => {
    const { data: authData, error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (error) {
      console.error(error);
      return;
    }

    // Guardar estado global
    setAuth({
      user: authData.user,
      token: authData.session?.access_token ?? null,
    });

    
    navigate("/private/add-clients", { replace: true });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <CustomInput<LoginFormValues>
        name="email"
        control={control}
        label="Email"
        type="text"
        error={errors.email}
      />

      <CustomInput<LoginFormValues>
        name="password"
        control={control}
        label="Password"
        type="password"
        error={errors.password}
      />

      <button type="submit">Guardar</button>
    </form>
  );
};
