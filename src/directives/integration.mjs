/** `client:afterpaint`: hydrate once the first contentful paint is on screen, so island JavaScript never delays it. */
export default function afterPaint() {
  return {
    name: 'client-afterpaint',
    hooks: {
      'astro:config:setup': ({ addClientDirective }) => {
        addClientDirective({ name: 'afterpaint', entrypoint: './src/directives/afterpaint.mjs' })
      },
    },
  }
}
