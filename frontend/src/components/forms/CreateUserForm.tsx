import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateUserSchema, type CreateUserInput } from "../../schemas";
import { useUsers } from "../../hooks/useUsers";

export default function CreateUserForm() {
  const { createUser } = useUsers();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CreateUserInput>({
    resolver: zodResolver(CreateUserSchema),
    mode: "onChange",
  });

  const onSubmit = handleSubmit(async (data) => {
    await createUser({
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
    });
    reset();
  });

  return (
    <form onSubmit={onSubmit} className="card p-3 mb-4">
      <h5 className="mb-3">Crear usuario</h5>

      <div className="row g-3">
        <div className="col-md-6">
          <label className="form-label">Nombre</label>
          <input
            className={`form-control ${errors.name ? "is-invalid" : ""}`}
            {...register("name")}
            placeholder="Ada Lovelace"
          />
          {errors.name && (
            <div className="invalid-feedback">{errors.name.message}</div>
          )}
        </div>
        <div className="col-md-6">
          <label className="form-label">Email</label>
          <input
            type="email"
            className={`form-control ${errors.email ? "is-invalid" : ""}`}
            {...register("email")}
            placeholder="ada@example.com"
          />
          {errors.email && (
            <div className="invalid-feedback">{errors.email.message}</div>
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
