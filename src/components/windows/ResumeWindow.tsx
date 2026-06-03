import { Resume } from '@/components/sections/Resume'
import { timeline } from '@/content/resume/timeline'
import { profile } from '@/content/resume/profile'
import { education } from '@/content/resume/education'
import { getCurriculoAssets } from '@/lib/curriculo-assets'

interface Props {
  locale: 'pt' | 'en'
}

export function ResumeWindow({ locale }: Props) {
  const assets = getCurriculoAssets()

  return (
    <div className="min-h-full">
      <Resume
        entries={timeline}
        profile={profile}
        education={education}
        assets={assets}
        locale={locale}
      />
    </div>
  )
}
