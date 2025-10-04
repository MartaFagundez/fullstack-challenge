import { z } from "zod";

// Utilidad: aceptar coma o punto y devolver number
const parseDecimal = (v: unknown) => {
  if (typeof v === "number") return v;
  if (typeof v !== "string") return NaN;
  const n = Number(v.trim().replace(",", "."));
  return Number.isNaN(n) ? NaN : n;
};

export const CreateUserSchema = z.object({
  name: z.string().trim().min(2, "El nombre es muy corto").max(120),
  email: z.email("Email inválido").max(255),
});
export type CreateUserInput = z.infer<typeof CreateUserSchema>;

export const CreateOrderSchema = z.object({
  user_id: z.number().int("ID inválido").positive(),
  product_name: z
    .string()
    .trim()
    .min(2, "Nombre de producto muy corto")
    .max(200),
  // amount = "importe" (decimal), mínimo > 0
  amount: z.preprocess(
    parseDecimal,
    z.number().positive("El importe debe ser mayor a 0")
  ),
});
export type CreateOrderInput = z.infer<typeof CreateOrderSchema>;
