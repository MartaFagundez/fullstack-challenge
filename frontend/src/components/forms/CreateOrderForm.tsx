import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CreateOrderFormSchema,
  type CreateOrderFormInput,
} from "../../validation/schemas";
import { ApiError, createOrder, listUsers } from "../../services/api";
import { useNotify } from "../../hooks/useNotify";
import type { User } from "../../types/api";
import { parseAmount } from "../../utils/number";

export default function CreateOrderForm({
  onCreated,
}: {
  onCreated?: () => void;
}) {
  const notify = useNotify();
  const [users, setUsers] = useState<User[]>([]);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm<CreateOrderFormInput>({
    resolver: zodResolver(CreateOrderFormSchema),
    mode: "onTouched",
  });

  useEffect(() => {
    (async () => {
      try {
        const res = await listUsers({ page: 1, limit: 50 });
        setUsers(res.items);
      } catch {
        /* ignore: el error se mostrará al enviar si corresponde */
      }
    })();
  }, []);

  const onSubmit = async (data: CreateOrderFormInput) => {
    try {
      // Validar y convertir el amount
      const amount = parseAmount(data.amount);
      if (amount === null) {
        notify.error("Formato de importe inválido");
        return;
      }
      if (amount <= 0) {
        notify.error("El importe debe ser mayor que cero");
        return;
      }

      await createOrder({
        user_id: data.user_id,
        product_name: data.product_name.trim(),
        amount: amount,
      });
      notify.success("Orden creada");
      reset();
      // RHF no resetea select a '' por defecto; lo forzamos:
      setValue("user_id", NaN as unknown as number);
      onCreated?.();
    } catch (e) {
      const msg =
        e instanceof ApiError
          ? (e.payload?.error?.message ?? e.message)
          : "Error inesperado";
      notify.error(msg);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="card p-3 mb-4">
      <h5 className="mb-3">Crear orden</h5>

      <div className="row g-3">
        <div className="col-md-4">
          <label className="form-label">Usuario</label>
          <select
            className="form-select"
            {...register("user_id", { valueAsNumber: true })}
            defaultValue=""
          >
            <option value="" disabled>
              Selecciona un usuario…
            </option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name} — {u.email}
              </option>
            ))}
          </select>
          {errors.user_id && (
            <div className="text-danger small mt-1">
              {errors.user_id.message}
            </div>
          )}
        </div>

        <div className="col-md-5">
          <label className="form-label">Producto</label>
          <input
            className="form-control"
            placeholder="Cuaderno A4"
            {...register("product_name")}
          />
          {errors.product_name && (
            <div className="text-danger small mt-1">
              {errors.product_name.message}
            </div>
          )}
        </div>

        <div className="col-md-3">
          <label className="form-label">Importe</label>
          <input
            className="form-control"
            placeholder="12,50 o 12.50"
            {...register("amount" as const)}
          />
          {errors.amount && (
            <div className="text-danger small mt-1">
              {errors.amount.message}
            </div>
          )}
        </div>
      </div>

      <div className="mt-3">
        <button className="btn btn-primary" disabled={isSubmitting}>
          {isSubmitting ? "Creando…" : "Crear orden"}
        </button>
      </div>
    </form>
  );
}
