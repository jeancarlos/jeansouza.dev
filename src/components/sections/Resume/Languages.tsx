interface Props {
  value: string
}

export function Languages({ value }: Props) {
  return (
    <p className="text-sm text-latte-subtext">{value}</p>
  )
}
