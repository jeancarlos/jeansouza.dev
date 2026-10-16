import { describe, it, expect } from 'vitest'
import { splitPostBody } from './postBody'

const block = (yaml: string) => `<script type="text/yaml" data-timeline>\n${yaml}</script>`

describe('splitPostBody', () => {
  it('keeps a body without timelines as one html part', () => {
    expect(splitPostBody('<p>only</p>', 'post')).toEqual([{ html: '<p>only</p>' }])
  })

  it('lazy-loads images in the body', () => {
    expect(splitPostBody('<p><img src="/a.svg" alt="a"></p>', 'post')).toEqual([
      { html: '<p><img loading="lazy" data-fade src="/a.svg" alt="a"></p>' },
    ])
  })

  it('leaves an image that already says how to load alone', () => {
    const html = '<img loading="eager" src="/a.svg" alt="a"><img\nsrc="/b.svg" alt="b">'
    expect(splitPostBody(html, 'post')).toEqual([
      {
        html: '<img loading="eager" src="/a.svg" alt="a"><img loading="lazy" data-fade src="/b.svg" alt="b">',
      },
    ])
  })

  it('splits the html around each timeline block, keeping text as written', () => {
    const yaml =
      '- date: "2024 – 2026"\n  title: Senior "dev" & <lead>\n\n  meta: Zydon\n  items:\n    - built <tests>\n  dotted: true\n- date: "2020"\n  title: First job\n'
    expect(splitPostBody(`<p>a</p>\n${block(yaml)}\n<p>b</p>`, 'post')).toEqual([
      { html: '<p>a</p>\n' },
      {
        timeline: [
          {
            date: '2024 – 2026',
            title: 'Senior "dev" & <lead>',
            meta: 'Zydon',
            items: ['built <tests>'],
            dotted: true,
          },
          { date: '2020', title: 'First job' },
        ],
      },
      { html: '\n<p>b</p>' },
    ])
  })

  it.each([
    ['an empty block', ''],
    ['a missing title', '- date: "2020"\n'],
    ['items that are not text', '- date: "2020"\n  title: A\n  items: nope\n'],
  ])('fails the build on %s, naming the post', (_, yaml) => {
    expect(() => splitPostBody(block(yaml), 'my-post.pt')).toThrow(/my-post\.pt/)
  })
})
