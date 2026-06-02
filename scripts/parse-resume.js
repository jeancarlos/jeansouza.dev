/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs')
const path = require('path')
const yaml = require('js-yaml')

const yamlPath = '/home/jean/Projects/curriculo/resume-base.yaml'
const outputPath = path.join(__dirname, '../src/content/resume/timeline.ts')

try {
  const fileContents = fs.readFileSync(yamlPath, 'utf8')
  const data = yaml.load(fileContents)

  if (!data || !data.jobs) {
    console.error('Invalid resume-base.yaml format: no jobs found.')
    process.exit(1)
  }

  const timelineEntries = data.jobs.map((job, index) => {
    const id = `job-${index + 1}`

    // Join accomplishments with bullet points and newlines
    const accomplishmentsPt = job.accomplishments
      ? job.accomplishments.map((acc) => `• ${acc.pt}`).join('\n')
      : ''

    const accomplishmentsEn = job.accomplishments
      ? job.accomplishments.map((acc) => `• ${acc.en}`).join('\n')
      : ''

    return {
      id,
      year: {
        pt: job.period_pt || '',
        en: job.period_en || '',
      },
      role: {
        pt: job.role_pt || '',
        en: job.role_en || '',
      },
      company: job.company || '',
      description: {
        pt: accomplishmentsPt,
        en: accomplishmentsEn,
      },
    }
  })

  const outputCode = `export interface TimelineEntry {
  id: string
  year: { pt: string; en: string }
  role: { pt: string; en: string }
  company: string
  description: { pt: string; en: string }
}

export const timeline: TimelineEntry[] = ${JSON.stringify(timelineEntries, null, 2)};
`

  fs.writeFileSync(outputPath, outputCode, 'utf8')
  console.log(
    `Successfully parsed resume and wrote ${timelineEntries.length} entries to ${outputPath}`
  )
} catch (error) {
  console.error('Error parsing resume:', error)
  process.exit(1)
}
