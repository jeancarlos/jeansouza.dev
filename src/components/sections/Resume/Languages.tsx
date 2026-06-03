interface Props {
  value: string
}

export function Languages({ value }: Props) {
  return <p className="text-subtext text-sm">{value}</p>
}
