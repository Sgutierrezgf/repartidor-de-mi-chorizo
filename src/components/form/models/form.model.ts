import z from "zod";

export const formSchema = z.object({
  name: z.string().min(2),
  products: z.array(
    z.object({
      type: z.enum(["normal", "pimienta", "picante"]),
      amount: z.number().min(1),
    })
  ).min(1, "Debes agregar al menos un producto")
});

export type FormValues = z.infer<typeof formSchema>;

export const loginFormSchema = z.object({
  email: z.email({ message: "Email invalido" }),
  password: z.string().min(6, { message: "La contraseña debe tener al menos 6 caracteres" }),
});

export type LoginFormValues = z.infer<typeof loginFormSchema>;

