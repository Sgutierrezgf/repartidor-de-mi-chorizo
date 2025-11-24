import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import CustomInput from "./components/CustomInput";
import { useNavigate } from "react-router-dom";
import { useGlobalContext } from "../../context/global.context";
import { supabase } from "../../utilities";
import { type LoginFormValues, loginFormSchema } from "./models";
import { Button } from "../bottons/Button";
import { useState } from "react";


export const LoginForm = () => {
  const navigate = useNavigate();
  const { setAuth } = useGlobalContext();
  const [messageError, setMessageError] = useState<string | null>(null);

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
      setMessageError(error.message);
      return;
    }

    setAuth({
      user: authData.user,
      token: authData.session?.access_token ?? null,
    });

    
    navigate("/private/add-clients", { replace: true });
  };

  return (
<div className="h-screen grid place-items-center px-4">
    <div className="w-full max-w-sm mx-auto">

      <h2 className="text-3xl font-bold text-gray-800 mb-8 text-left">
        Iniciar sesión
      </h2>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-5"
      >
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

        {messageError && (
          <p className="text-red-600 text-sm text-center">
            {messageError}
          </p>
        )}

        <Button type="submit">Ingresar</Button>
      </form>
    </div>
  </div>
  );
};




