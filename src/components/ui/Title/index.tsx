interface TitleProps {
  children: React.ReactNode
}

export function Title({ children }: TitleProps) {
  return (
    <h1 className="bg-[linear-gradient(to_right,var(--color-brand-from),var(--color-brand-to))] bg-clip-text pb-[0.3em] text-[2em] leading-[0.9em] font-bold text-transparent">
      {children}
    </h1>
  )
}
