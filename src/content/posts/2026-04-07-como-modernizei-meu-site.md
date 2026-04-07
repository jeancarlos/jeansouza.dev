---
title: How I modernized jeansouza.dev
date: 2026-04-07
description: Migrating from Create React App to Next.js 15 with TypeScript, Tailwind CSS, and a built-in scroll-based blog.
---

## The problem

My personal site was running on Create React App — a tool officially archived by the React team in 2023. React 16, Stylus for CSS, deployed manually with the `gh-pages` CLI. It worked, but it wasn't something I'd point to as evidence of my front-end skills.

## The new stack

| Concern | Before | After |
|---------|--------|-------|
| Framework | Create React App 3 | Next.js 15 |
| Language | JavaScript | TypeScript |
| CSS | Stylus | Tailwind CSS |
| Icons | FontAwesome 5 | FontAwesome 6 |
| Deploy | gh-pages CLI | GitHub Actions |

## Architecture

The site is fully static. Next.js generates HTML at build time using `output: 'export'` and publishes the `out/` directory to the `gh-pages` branch on every push via GitHub Actions running on a self-hosted server.

```
Browser → GitHub Pages (CDN)
               ↑
         GitHub Actions
        (self-hosted runner)
               ↑
         git push master
```

## The blog

Posts are Markdown files in `src/content/posts/`. Frontmatter holds title, date, and description. A utility in `src/lib/posts.ts` reads them at build time using Node's `fs` module — no CMS, no API, no database.

To write a new post: create a `.md` file, commit, push. GitHub Actions rebuilds and deploys automatically.

## Scroll navigation

The home page loads all posts inline. As you scroll, `IntersectionObserver` detects which post is in view and updates the URL via `history.pushState` — giving each post a shareable URL without a full page navigation. Entering the site at `/blog/slug/` renders just that post with a link back to home.

## What stayed the same

The visual identity is unchanged: dark purple background, pink/rose text, gradient accents, dot-grid pattern. The Button component kept its animated hover effect. Same fonts (Poppins + Roboto). Only the CSS authoring method changed — from Stylus to Tailwind with CSS Modules for complex animations.
