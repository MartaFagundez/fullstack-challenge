import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CreateUserSchema,
  type CreateUserInput,
} from "../../validation/schemas";
import { ApiError, createUser } from "../../services/api";
import { useNotify } from "../../hooks/useNotify";

export default function CreateUserForm({
  onCreated,
}: {
  onCreated?: () => void;
}) {
  const notify = useNotify();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CreateUserInput>({
    resolver: zodResolver(CreateUserSchema),
    mode: "onTouched",
  });

  const onSubmit = async (data: CreateUserInput) => {
    try {
      await createUser({
        name: data.name.trim(),
        email: data.email.trim().toLowerCase(),
      });
      notify.success("Usuario creado");
      reset();
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
      <h5 className="mb-3">Crear usuario</h5>

      <div className="row g-3">
        <div className="col-md-6">
          <label className="form-label">Nombre</label>
          <input
            className="form-control"
            placeholder="Ada Lovelace"
            {...register("name")}
          />
          {errors.name && (
            <div className="text-danger small mt-1">{errors.name.message}</div>
          )}
        </div>
        <div className="col-md-6">
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            placeholder="ada@example.com"
            {...register("email")}
          />
          {errors.email && (
            <div className="text-danger small mt-1">{errors.email.message}</div>
          )}
        </div>
      </div>

      <div className="mt-3">
        <button className="btn btn-primary" disabled={isSubmitting}>
          {isSubmitting ? "Creando…" : "Crear usuario"}
        </button>
      </div>
    </form>
  );
}
