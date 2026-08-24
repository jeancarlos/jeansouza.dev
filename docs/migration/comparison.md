# Migration comparison: Next 16 to Astro 7

Same script (`scripts/measure.mjs`), same pinned Chrome, same machine, median of 3 runs per page per form factor. Raw runs are in `baseline/report.json` and `after/report.json`.

**11 distinct pages.** The two `como-modernizei-meu-site` rows are redirect stubs kept from a pre-rename slug; Lighthouse followed them, so they measured the post page twice. They are shown for completeness and excluded from every total.

## JavaScript transferred

| Page | Before | After | Change |
|---|--:|--:|--:|
| `/` | 662 KB | 191 KB | -471 KB ✓ |
| `/en/` | 1025 KB | 191 KB | -834 KB ✓ |
| `/en/blog/` | 1025 KB | 191 KB | -834 KB ✓ |
| `/en/blog/2026-06-03-como-modernizei-meu-site/ *(redirect)*` | 1025 KB | 191 KB | -834 KB ✓ |
| `/en/blog/2026-06-03-por-que-eu-construi-esse-site-do-jeito-que-construi/` | 1025 KB | 191 KB | -834 KB ✓ |
| `/en/more/` | 1028 KB | 191 KB | -837 KB ✓ |
| `/en/resume/` | 1049 KB | 191 KB | -858 KB ✓ |
| `/pt/` | 1025 KB | 191 KB | -834 KB ✓ |
| `/pt/blog/` | 1025 KB | 191 KB | -834 KB ✓ |
| `/pt/blog/2026-06-03-como-modernizei-meu-site/ *(redirect)*` | 1025 KB | 191 KB | -834 KB ✓ |
| `/pt/blog/2026-06-03-por-que-eu-construi-esse-site-do-jeito-que-construi/` | 1025 KB | 191 KB | -834 KB ✓ |
| `/pt/more/` | 1028 KB | 191 KB | -837 KB ✓ |
| `/pt/resume/` | 1049 KB | 191 KB | -858 KB ✓ |
| **Total (11 pages)** | **10966 KB** | **2101 KB** | **-8865 KB ✓** |

Reduction: **81%**.

## Lighthouse

| Page | Perf mobile | Perf desktop | LCP mobile | TBT mobile |
|---|--:|--:|--:|--:|
| `/` | 77 → 96 (+19 ✓) | 97 → 100 (+3 ✓) | 6292 → 2552 ms | 71 → 0 ms |
| `/en/` | 69 → 98 (+29 ✓) | 95 → 100 (+5 ✓) | 8578 → 2253 ms | 301 → 14 ms |
| `/en/blog/` | 75 → 97 (+22 ✓) | 95 → 100 (+5 ✓) | 8365 → 2402 ms | 109 → 1 ms |
| `/en/blog/2026-06-03-por-que-eu-construi-esse-site-do-jeito-que-construi/` | 74 → 96 (+22 ✓) | 95 → 100 (+5 ✓) | 8388 → 2552 ms | 127 → 0 ms |
| `/en/more/` | 68 → 97 (+29 ✓) | 94 → 100 (+6 ✓) | 8597 → 2402 ms | 324 → 0 ms |
| `/en/resume/` | 62 → 97 (+35 ✓) | 94 → 100 (+6 ✓) | 8655 → 2401 ms | 484 → 0 ms |
| `/pt/` | 72 → 97 (+25 ✓) | 95 → 100 (+5 ✓) | 8437 → 2402 ms | 191 → 5 ms |
| `/pt/blog/` | 70 → 97 (+27 ✓) | 95 → 100 (+5 ✓) | 8521 → 2402 ms | 240 → 0 ms |
| `/pt/blog/2026-06-03-por-que-eu-construi-esse-site-do-jeito-que-construi/` | 61 → 96 (+35 ✓) | 95 → 100 (+5 ✓) | 8558 → 2552 ms | 525 → 0 ms |
| `/pt/more/` | 69 → 97 (+28 ✓) | 94 → 100 (+6 ✓) | 8585 → 2401 ms | 290 → 0 ms |
| `/pt/resume/` | 73 → 97 (+24 ✓) | 94 → 100 (+6 ✓) | 8569 → 2401 ms | 156 → 0 ms |

## axe-core violations

Node counts across both viewports, all pages.

| Rule | Impact | Before | After |
|---|---|--:|--:|
| `color-contrast` | | 112 | 20 |
| `region` | | 26 | 0 |
| `scrollable-region-focusable` | | 4 | 0 |

`color-contrast` is **not fixed** — it is the one rule still failing, and the drop from 112 to 20 nodes is a side effect, not work. Fewer elements are painted per page now, so fewer of them fail; the palette itself is unchanged. It is rebuilt in phase 2 under `09 - Specs/2026-08-23-jeansouza-dev-visual-system-design.md`. Reporting it as outstanding is the point: a comparison that quietly banks an accidental improvement is as dishonest as one that drops the metric entirely.

## The gap this migration was built to show

Lighthouse scored accessibility 96-100 on the Next site while axe found 26 missing-landmark violations and 4 scrollable regions no keyboard could reach. Those scores are **identical after the fix**: 100 stayed 100, 96 stayed 96. The score did not notice the defects and did not notice them being repaired. Lighthouse runs a subset of axe and weights what it runs; it never claimed to be an audit. A green accessibility score beside a keyboard trap is the thing worth writing about.
