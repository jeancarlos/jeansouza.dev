import { LanguageSwitch } from '@/components/layout/LanguageSwitch'

export function Topbar() {
  return (
    <div className="bg-crust relative flex w-full items-center justify-end px-4 py-2 font-normal [box-shadow:0px_-25px_25px_50px_rgba(0,0,0,0.1)]">
      <LanguageSwitch />
    </div>
  )
}
