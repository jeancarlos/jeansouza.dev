export type SurfaceId = 'terminal' | 'blog' | 'post' | 'resume' | 'more'

export interface SurfaceSpec {
  /**
   * `dialog` for a surface that opens its own contained interaction; `region`
   * for a named landmark section that is simply persistent page content.
   *
   * `application` is never correct here. ARIA reserves it for focusable content
   * needing input conventions no standard widget pattern represents, and a
   * desktop metaphor is not that. `alertdialog` is reserved for an interruptive
   * modal alert that asks for a response, which none of these are.
   */
  role: 'dialog' | 'region'
  labelKey: string
  /** Always false: the rest of the desktop stays operable, so aria-modal would lie. */
  modal: false
  /** True when the body can overflow, which forces the focusable-body treatment. */
  scrollable: boolean
}

export const SURFACES: Record<SurfaceId, SurfaceSpec> = {
  // Starts a contained interaction of its own, so it is a dialog.
  terminal: { role: 'dialog', labelKey: 'windows.terminal', modal: false, scrollable: true },
  // The rest are page content that happens to be framed: named regions, which
  // also carries the landmark work into every window.
  blog: { role: 'region', labelKey: 'windows.blog', modal: false, scrollable: false },
  post: { role: 'region', labelKey: 'windows.post', modal: false, scrollable: true },
  resume: { role: 'region', labelKey: 'windows.resume', modal: false, scrollable: true },
  more: { role: 'region', labelKey: 'windows.more', modal: false, scrollable: false },
}
