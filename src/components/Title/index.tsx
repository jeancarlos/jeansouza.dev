interface TitleProps {
  children: React.ReactNode
}

export function Title({ children }: TitleProps) {
  return (
    <h1 className="bg-brand-gradient bg-clip-text pb-[0.3em] text-[2em] font-bold leading-[0.9em] text-transparent">
      {children}
    </h1>
  )
}
