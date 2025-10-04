import { useEffect, useState } from "react";

type Props = {
  value?: string;
  onChange: (v: string) => void;
  delay?: number;
  placeholder?: string;
  className?: string;
};

export default function DebouncedInput({
  value = "",
  onChange,
  delay = 300,
  placeholder,
  className,
}: Props) {
  const [local, setLocal] = useState(value);

  useEffect(() => setLocal(value), [value]);

  useEffect(() => {
    const id = setTimeout(() => onChange(local), delay);
    return () => clearTimeout(id);
  }, [local, delay, onChange]);

  return (
    <input
      className={className ?? "form-control"}
      value={local}
      onChange={(e) => setLocal(e.target.value)}
      placeholder={placeholder}
    />
  );
}
