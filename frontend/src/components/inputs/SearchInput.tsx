type Props = {
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
};

export default function SearchInput({
  placeholder = "Buscar…",
  value,
  onChange,
}: Props) {
  return (
    <input
      className="form-control"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
    />
  );
}
