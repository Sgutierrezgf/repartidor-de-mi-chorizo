import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useGlobalContext } from "../../context/global.context";
import { supabase } from "../../utilities";
import { type LoginFormValues, loginFormSchema } from "./models";
import { Button } from "../bottons/Button";
import logo from "../../assets/img/chorizos.jpeg";

export const LoginForm = () => {
  const navigate = useNavigate();
  const { setAuth } = useGlobalContext();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
  });

  const onSubmit: SubmitHandler<LoginFormValues> = async (data) => {
    setSubmitError(null);
    setIsSubmitting(true);

    const { data: authData, error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    setIsSubmitting(false);

    if (error) {
      setSubmitError(error.message);
      return;
    }

    setAuth({
      user: authData.user,
      token: authData.session?.access_token ?? null,
    });

    navigate("/private/ventas", { replace: true });
  };

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4 py-10">
      <div className="rounded-lg border border-line bg-surface p-6 sm:p-8">
        <div className="mb-6 flex items-center gap-3">
          <img
            src={logo}
            alt=""
            className="h-14 w-14 rounded-full object-cover ring-1 ring-line"
          />
          <div>
            <h1 className="font-display text-2xl font-bold">Mi registro</h1>
            <p className="text-sm text-ink-muted">Entra a tu libreta de ventas</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-semibold" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              {...register("email")}
              className="w-full rounded-md border border-line bg-paper px-3 py-2 outline-none focus:border-blood"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-blood">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold" htmlFor="password">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              {...register("password")}
              className="w-full rounded-md border border-line bg-paper px-3 py-2 outline-none focus:border-blood"
            />
            {errors.password && (
              <p className="mt-1 text-sm text-blood">{errors.password.message}</p>
            )}
          </div>

          {submitError && (
            <p className="text-sm text-blood" role="alert">
              {submitError}
            </p>
          )}

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Entrando…" : "Entrar"}
          </Button>
        </form>
      </div>
    </div>
  );
};
