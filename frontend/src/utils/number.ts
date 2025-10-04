// Permite ingresar decimales con coma o punto y devolver number
export function parseAmount(input: string): number | null {
  if (!input) return null;
  // normaliza coma a punto y quita espacios
  const normalized = input.trim().replace(",", ".");
  const num = Number(normalized);
  if (Number.isNaN(num)) return null;
  return num;
}

// Formateo de visualización (se puede cambiar aquí si la moneda utilizada lo requiere)
export function formatAmount(n: number): string {
  return n.toFixed(2);
}
