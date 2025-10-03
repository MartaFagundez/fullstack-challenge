type Props = { message: string };

export default function InlineError({ message }: Props) {
  return (
    <div className="alert alert-danger py-2 my-2" role="alert">
      {message}
    </div>
  );
}
