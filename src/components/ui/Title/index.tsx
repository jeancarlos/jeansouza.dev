interface TitleProps {
  children: React.ReactNode
}

export function Title({ children }: TitleProps) {
  return (
    <h1 className="bg-[linear-gradient(to_right,var(--color-mauve),var(--color-blue))] bg-clip-text pb-[0.3em] text-[2em] leading-[0.9em] font-bold text-transparent">
      {children}
    </h1>
  )
}
