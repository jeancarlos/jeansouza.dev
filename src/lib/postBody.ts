import { parse } from 'yaml'
import type { TimelineEntry } from '@/components/ui/Timeline'

export type BodyPart = { html: string } | { timeline: TimelineEntry[] }

const TIMELINE = /<script type="text\/yaml" data-timeline>([\s\S]*?)<\/script>/

const isText = (v: unknown): v is string => typeof v === 'string' && v.trim() !== ''

const isTextList = (v: unknown): v is string[] => Array.isArray(v) && v.every(isText)

function problem(e: Record<string, unknown>): string | undefined {
  if (!isText(e.date) || !isText(e.title)) return 'needs a date and a title'
  if (e.meta !== undefined && !isText(e.meta)) return 'has an empty meta'
  if (e.items !== undefined && !isTextList(e.items)) return 'items must be a list of text'
  return undefined
}

function toEntry(raw: unknown, n: number, where: string): TimelineEntry {
  const e = (raw ?? {}) as Record<string, unknown>
  const why = problem(e)
  if (why) throw new Error(`${where}: timeline entry ${n} ${why}`)
  return {
    date: e.date as string,
    title: e.title as string,
    ...(isText(e.meta) && { meta: e.meta }),
    ...(isTextList(e.items) && { items: e.items }),
    ...(e.dotted === true && { dotted: true }),
  }
}

function toTimeline(yaml: string, where: string): TimelineEntry[] {
  const list: unknown = parse(yaml)
  if (!Array.isArray(list) || list.length === 0)
    throw new Error(`${where}: a timeline block must be a non-empty YAML list`)
  return list.map((raw, i) => toEntry(raw, i + 1, where))
}

export function splitPostBody(html: string, where: string): BodyPart[] {
  return html.split(TIMELINE).flatMap((piece, i): BodyPart[] => {
    if (i % 2 === 1) return [{ timeline: toTimeline(piece, where) }]
    return piece.trim() === '' ? [] : [{ html: piece.replaceAll('<img ', '<img loading="lazy" ') }]
  })
}
