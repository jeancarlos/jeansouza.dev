import { Button } from '@/components/ui/Button'

export default function NotFound() {
  return (
    <main className="flex min-h-dvh items-center justify-center p-4">
      <div className="from-brand-from to-brand-to w-full max-w-md rounded-2xl bg-gradient-to-r p-[2px] shadow-2xl">
        <div className="bg-crust text-brand-text rounded-[14px] font-mono">
          <div className="from-brand-from to-brand-to flex items-center gap-2 rounded-t-[14px] bg-gradient-to-r px-3 py-2.5 select-none">
            <span className="bg-traffic-close h-3.5 w-3.5 rounded-full ring-1 ring-white/40" />
            <span className="bg-traffic-minimize h-3.5 w-3.5 rounded-full ring-1 ring-white/40" />
            <span className="bg-traffic-expand h-3.5 w-3.5 rounded-full ring-1 ring-white/40" />
            <span className="ml-2 text-xs text-white/80">~ 404</span>
          </div>
          <div className="space-y-4 p-6">
            <p className="text-brand-to text-xs">$ cat 404.txt</p>
            <p className="font-display text-text text-2xl font-bold">
              404 <span className="text-brand-from">_</span>
            </p>
            <p className="text-subtext text-sm leading-relaxed">
              Essa página não existe (ou foi movida). Recomendo voltar para a home.
              <br />
              <span className="text-overlay">
                This page doesn&apos;t exist (or has moved). Head back home.
              </span>
            </p>
            <div className="pt-2">
              <Button href="/">
                <i className="fas fa-home mr-1" aria-hidden="true" /> Voltar para a home
              </Button>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
