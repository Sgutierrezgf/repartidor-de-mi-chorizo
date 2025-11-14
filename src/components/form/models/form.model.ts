import z from "zod";

export const formSchema = z.object({
  name: z
    .string()
    .min(2, { message: "El nombre es muy corto" })
    .max(50, { message: "El nombre es muy largo" }),
  amount: z.string().min(1, { message: "La cantidad debe ser al menos 1" }),
  type: z.string().min(7, { message: "el tipo debe ser valido" }),
});

export type FormValues = z.infer<typeof formSchema>;

export const loginFormSchema = z.object({
  email: z.email({ message: "Email invalido" }),
  password: z.string().min(6, { message: "La contraseña debe tener al menos 6 caracteres" }),
});

export type LoginFormValues = z.infer<typeof loginFormSchema>;

