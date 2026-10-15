import 'astro'

declare module 'astro' {
  interface AstroClientDirectives {
    'client:afterpaint'?: boolean
  }
}
