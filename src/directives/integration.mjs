/** `client:afterpaint`: hydrate once the first frame is on screen, so island JavaScript never delays first paint. */
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
