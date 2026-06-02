import { Resume } from '@/components/sections/Resume'
import { timeline } from '@/content/resume/timeline'

interface Props {
  locale: 'pt' | 'en'
}

export function ResumeWindow({ locale }: Props) {
  return (
    <div className="min-h-full bg-[#3e3353]">
      <Resume entries={timeline} locale={locale} />
    </div>
  )
}
