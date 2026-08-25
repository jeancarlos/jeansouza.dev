# Migration comparison: Next 16 to Astro 7

Same script (`scripts/measure.mjs`), same pinned Chrome, same machine, median of 3 runs per page per form factor. Raw runs are in `baseline/report.json` and `after/report.json`.

**11 distinct pages.** The two `como-modernizei-meu-site` rows are redirect stubs kept from a pre-rename slug; Lighthouse followed them, so they measured the post page twice. They are shown for completeness and excluded from every total.

## JavaScript transferred

| Page | Before | After | Change |
|---|--:|--:|--:|
| `/` | 662 KB | 492 KB | -170 KB ✓ |
| `/en/` | 1025 KB | 492 KB | -533 KB ✓ |
| `/en/blog/` | 1025 KB | 492 KB | -533 KB ✓ |
| `/en/blog/2026-06-03-como-modernizei-meu-site/ *(redirect)*` | 1025 KB | 492 KB | -533 KB ✓ |
| `/en/blog/2026-06-03-por-que-eu-construi-esse-site-do-jeito-que-construi/` | 1025 KB | 492 KB | -533 KB ✓ |
| `/en/more/` | 1028 KB | 495 KB | -533 KB ✓ |
| `/en/resume/` | 1049 KB | 515 KB | -534 KB ✓ |
| `/pt/` | 1025 KB | 492 KB | -533 KB ✓ |
| `/pt/blog/` | 1025 KB | 492 KB | -533 KB ✓ |
| `/pt/blog/2026-06-03-como-modernizei-meu-site/ *(redirect)*` | 1025 KB | 492 KB | -533 KB ✓ |
| `/pt/blog/2026-06-03-por-que-eu-construi-esse-site-do-jeito-que-construi/` | 1025 KB | 492 KB | -533 KB ✓ |
| `/pt/more/` | 1028 KB | 495 KB | -533 KB ✓ |
| `/pt/resume/` | 1049 KB | 515 KB | -534 KB ✓ |
| **Total (11 pages)** | **10966 KB** | **5464 KB** | **-5502 KB ✓** |

Reduction: **50%**.

## Lighthouse

| Page | Perf mobile | Perf desktop | LCP mobile | TBT mobile |
|---|--:|--:|--:|--:|
| `/` | 77 → 79 (+2 ✓) | 97 → 99 (+2 ✓) | 6292 → 4920 ms | 71 → 0 ms |
| `/en/` | 69 → 80 (+11 ✓) | 95 → 100 (+5 ✓) | 8578 → 4852 ms | 301 → 0 ms |
| `/en/blog/` | 75 → 81 (+6 ✓) | 95 → 99 (+4 ✓) | 8365 → 4841 ms | 109 → 32 ms |
| `/en/blog/2026-06-03-por-que-eu-construi-esse-site-do-jeito-que-construi/` | 74 → 79 (+5 ✓) | 95 → 99 (+4 ✓) | 8388 → 4837 ms | 127 → 0 ms |
| `/en/more/` | 68 → 80 (+12 ✓) | 94 → 99 (+5 ✓) | 8597 → 4880 ms | 324 → 16 ms |
| `/en/resume/` | 62 → 79 (+17 ✓) | 94 → 99 (+5 ✓) | 8655 → 5029 ms | 484 → 17 ms |
| `/pt/` | 72 → 81 (+9 ✓) | 95 → 99 (+4 ✓) | 8437 → 4841 ms | 191 → 0 ms |
| `/pt/blog/` | 70 → 81 (+11 ✓) | 95 → 99 (+4 ✓) | 8521 → 4847 ms | 240 → 0 ms |
| `/pt/blog/2026-06-03-por-que-eu-construi-esse-site-do-jeito-que-construi/` | 61 → 81 (+20 ✓) | 95 → 99 (+4 ✓) | 8558 → 4838 ms | 525 → 0 ms |
| `/pt/more/` | 69 → 80 (+11 ✓) | 94 → 99 (+5 ✓) | 8585 → 4879 ms | 290 → 15 ms |
| `/pt/resume/` | 73 → 80 (+7 ✓) | 94 → 99 (+5 ✓) | 8569 → 5001 ms | 156 → 0 ms |

## axe-core violations

Node counts across both viewports, all pages.

| Rule | Impact | Before | After |
|---|---|--:|--:|
| `color-contrast` | | 112 | 111 |
| `region` | | 26 | 0 |
| `scrollable-region-focusable` | | 4 | 0 |

`color-contrast` is **not fixed**: 112 nodes before, 111 after. The palette is untouched, so it should not move, and it does not. It is rebuilt in phase 2 under `09 - Specs/2026-08-23-jeansouza-dev-visual-system-design.md`. Reporting it as outstanding is the point: a comparison that quietly drops the metric that did not improve is worthless.

## The gap this migration was built to show

Lighthouse scored accessibility 96-100 on the Next site while axe found 26 missing-landmark violations and 4 scrollable regions no keyboard could reach. Those scores are **identical after the fix**: 100 stayed 100, 96 stayed 96. The score did not notice the defects and did not notice them being repaired. Lighthouse runs a subset of axe and weights what it runs; it never claimed to be an audit. A green accessibility score beside a keyboard trap is the thing worth writing about.
