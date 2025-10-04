import { z } from "zod";
import { parseAmount } from "../utils/number";

export const CreateUserSchema = z.object({
  name: z.string().min(1, "Nombre requerido"),
  email: z.email("Email inválido"),
});

export type CreateUserInput = z.infer<typeof CreateUserSchema>;

// Esquema para el formulario (acepta string en amount)
export const CreateOrderFormSchema = z.object({
  user_id: z
    .number("Selecciona un usuario")
    .int()
    .positive("Selecciona un usuario"),
  product_name: z.string().min(1, "Producto requerido"),
  amount: z.string().min(1, "Importe requerido"),
});

// Esquema para la validación final (convierte amount a number)
export const CreateOrderSchema = CreateOrderFormSchema.transform((data) => ({
  user_id: data.user_id,
  product_name: data.product_name,
  amount: (() => {
    const parsed = parseAmount(data.amount);
    if (parsed === null) {
      throw new Error("Formato de importe inválido");
    }
    if (parsed <= 0) {
      throw new Error("El importe debe ser mayor que cero");
    }
    return parsed;
  })(),
}));

export type CreateOrderFormInput = z.infer<typeof CreateOrderFormSchema>;
export type CreateOrderInput = z.infer<typeof CreateOrderSchema>;
