# Migration measurements

`scripts/measure.mjs` produces every number in `baseline/` and `after/`.

Method: build the site, serve `out/` (Next) or `dist/` (Astro) on `127.0.0.1:4321`,
then run the script. Lighthouse runs 3 times per page per form factor and the median
of each metric is reported; every raw run is kept in `report.json`. axe-core runs
once per page at 390x844 and once at 1440x900.

Dependencies are not vendored here. To reproduce:

    npm i --no-save lighthouse puppeteer axe-core chrome-launcher
    (cd out && python3 -m http.server 4321 --bind 127.0.0.1 &)
    node scripts/measure.mjs --base http://127.0.0.1:4321 --dist out --out docs/migration/baseline --runs 3

Baseline captured from `main` at cd3c187, before any Astro work.
