import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateOrderSchema } from "../../schemas";
import { useUsers } from "../../hooks/useUsers";
import { createOrder } from "../../services/api";
import { useToast } from "../../hooks/useToast";

export default function CreateOrderForm({
  onCreated,
}: {
  onCreated?: () => void;
}) {
  const { getUsers, cachedOptions } = useUsers();
  const { push } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm({
    resolver: zodResolver(CreateOrderSchema),
    mode: "onChange",
  });

  useEffect(() => {
    void getUsers(1, 50);
  }, [getUsers]); // precarga opciones

  const onSubmit = handleSubmit(async (data) => {
    await createOrder({
      user_id: data.user_id,
      product_name: data.product_name.trim(),
      amount: data.amount, // number (importe)
    });
    push({
      variant: "success",
      title: "Orden creada",
      message: `${data.product_name}`,
    });
    reset();
    onCreated?.();
  });

  return (
    <form onSubmit={onSubmit} className="card p-3 mb-4">
      <h5 className="mb-3">Crear orden</h5>

      <div className="row g-3">
        <div className="col-md-4">
          <label className="form-label">Usuario</label>
          <select
            className={`form-select ${errors.user_id ? "is-invalid" : ""}`}
            {...register("user_id", { valueAsNumber: true })}
            onChange={(e) => setValue("user_id", Number(e.target.value))}
            defaultValue=""
          >
            <option value="" disabled>
              Selecciona un usuario…
            </option>
            {cachedOptions.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name} — {u.email}
              </option>
            ))}
          </select>
          {errors.user_id && (
            <div className="invalid-feedback">{errors.user_id.message}</div>
          )}
        </div>

        <div className="col-md-5">
          <label className="form-label">Producto</label>
          <input
            className={`form-control ${errors.product_name ? "is-invalid" : ""}`}
            {...register("product_name")}
            placeholder="Cuaderno A4"
          />
          {errors.product_name && (
            <div className="invalid-feedback">
              {errors.product_name.message}
            </div>
          )}
        </div>

        <div className="col-md-3">
          <label className="form-label">Importe</label>
          <input
            inputMode="decimal"
            className={`form-control ${errors.amount ? "is-invalid" : ""}`}
            {...register("amount", {
              setValueAs: (value) => {
                if (typeof value === "string") {
                  return parseFloat(value.replace(",", "."));
                }
                return value;
              },
            })}
            placeholder="12,50 o 12.50"
          />
          {errors.amount && (
            <div className="invalid-feedback">{errors.amount.message}</div>
          )}
          <div className="form-text">Usa coma o punto para decimales</div>
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
