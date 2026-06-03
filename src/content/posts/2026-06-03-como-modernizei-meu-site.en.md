---
title: 'Rebuilding jeansouza.dev: A Mock OS and a Modern Stack'
date: 2026-06-03
description: How I migrated from a prehistoric Create React App setup to a high-fidelity windowed OS simulator with Next.js 15, Framer Motion, and fine-tuned interactions.
---

## The Wake-up Call

My personal website was frozen in time. Under the hood, it was powered by Create React App—a tool officially archived and put to rest by the React team back in 2023. It used React 16, Stylus for styling, and was deployed manually using the `gh-pages` CLI. While it technically served its purpose, it was no longer a representation of my skills or engineering standards.

As software developers, our personal portfolios are our digital calling cards. Looking at that old stack felt less like a calling card and more like a museum exhibit. It was time for a complete ground-up rewrite.

## The Goal: Desktop-in-a-Browser

I didn't want to build just another scroll-and-forget portfolio. I wanted something that felt alive, interactive, and slightly nostalgic, yet technically robust. I decided to simulate a windowed Desktop Environment right inside the browser.

The core requirements were strict:

1. **No Bloat**: No heavy external jQuery-era window manager libraries. It had to be built from scratch using modern React and Framer Motion.
2. **High-Fidelity Interaction**: Windows must be draggable, resizable (from all 8 directions), minimize-able, expand-able, and focus-aware.
3. **Static & Fast**: The site must export as fully static HTML (`output: 'export'`) to be served directly from a CDN (GitHub Pages), maintaining sub-second load times.
4. **Deeplinking**: Opening `/blog/some-post` should not just load a blank page; it should boot up the desktop simulator and open that specific post window automatically, keeping clean URLs via `history.pushState`.

## The Stack Shift

Here is how the old setup compares to the modern rebuild:

| Concern         | Before                        | After                               |
| :-------------- | :---------------------------- | :---------------------------------- |
| **Framework**   | Create React App 3 (Archived) | Next.js 15 (App Router)             |
| **Language**    | JavaScript                    | TypeScript                          |
| **Styling**     | Stylus CSS                    | Tailwind CSS + CSS Modules          |
| **Animations**  | Basic CSS transitions         | Framer Motion (AnimatePresence)     |
| **Icons**       | FontAwesome 5                 | FontAwesome 6                       |
| **Deployments** | Manual `gh-pages` CLI         | GitHub Actions (Self-hosted Runner) |

---

## Technical Deep-Dive: The Engineering Behind the Windows

Building a window manager in React sounds easy until you start handling edge cases like cursor drift, layout thrashing, and viewport constraints.

### 1. Pointer Capture & 8-Direction Resizing

A common bug in browser-based drag/resize components is that if the user moves the pointer too fast, the mouse leaves the handle's bounding box, and the interaction breaks.

To solve this, I leveraged the modern **Pointer Capture API** (`setPointerCapture`). When a pointer-down event is detected on any of the 8 resize handles (`n`, `s`, `e`, `w`, `ne`, `nw`, `se`, `sw`), we bind the pointer ID to that specific handle:

```typescript
const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
  e.stopPropagation()
  focusWindow(windowId)
  e.currentTarget.setPointerCapture(e.pointerId)
  // ... initialize drag state coordinates
}
```

This guarantees that all subsequent movement events are sent to the handle, even if the mouse cursor drifts outside the window boundaries.

To prevent layout thrashing (which causes stuttering on lower-end devices), we throttle the update cycles using `requestAnimationFrame`:

```typescript
rafRef.current = requestAnimationFrame(() => {
  if (pendingRef.current) {
    resizeWindow(windowId, pendingRef.current.size, pendingRef.current.position)
    pendingRef.current = null
  }
  rafRef.current = null
})
```

### 2. Physical Origin Targeting (The Pop Effect)

When a user clicks a button to open a window (like clicking a post in the blog file explorer), having the window just pop open in the center feels generic. Instead, we capture the bounding rectangle of the triggering button using `getBoundingClientRect()` and pass it to the new window:

```typescript
const rect = e.currentTarget.getBoundingClientRect()
onOpenPost(post, { x: rect.left, y: rect.top, width: rect.width, height: rect.height })
```

Framer Motion then uses this custom origin as the `initial` layout bounds, making the window expand dynamically directly from the clicked button. When closed, it collapses back into the button and fades out.

### 3. Z-Index and Focus Reducer

To simulate a real desktop, active windows must stand out. The state of all windows is managed in a single `useReducer` action pool. When a window is focused, its `zIndex` is incremented to be the highest in the stack.

Unfocused windows don't just stay behind; they visually recede using a CSS filter (`blur(2px)`) and drop to `0.6` opacity. This guides the user's attention back to the active interaction.

---

## URL Synchronization: Static Site, Dynamic Routing

Since Next.js compiles the entire project into static files (`out/`), we don't have a live Node server to parse paths dynamically at runtime. Yet, we want a single-page application feel with bookmarkable URLs.

To bridge this, we intercept navigation. When a window is focused or opened, we write to the browser's address history dynamically:

```typescript
history.pushState(null, '', topWindow.url)
```

If the user enters the site directly at `/en/blog/rebuilding-my-site`, Next.js's static routing engine serves the corresponding static export. When the React app mounts, the `HomeClient` component checks the URL parameters and immediately opens the window manager preloaded with the correct blog post. It's the best of both worlds: instant SEO-optimized static loading, combined with a single-page simulated OS experience.

## Internationalization & State Mirroring

Having a bilingual site (Portuguese & English) meant integrating `next-intl`. However, static builds make dynamic middleware routing challenging. We solved this by using a persistent cookie alongside a `localStorage` mirror. If there's a mismatch between the route locale and the user's saved preference on client mount, we trigger a client-side redirect.

## The Deploy Pipeline

Instead of relying on third-party cloud instances, I set up a self-hosted GitHub Actions runner on my local home server. Every time I push code to the repository:

1. The runner pulls the code.
2. Runs the build script (`npm run build`), which triggers the Next.js compiler.
3. Node reads all posts in `src/content/posts/` via the `fs` module, parses frontmatter via `gray-matter`, converts Markdown to HTML via `remark`, and writes them into the page templates.
4. The output directory (`out/`) is pushed directly to the `gh-pages` branch.

It is simple, local, and completely free.

## What's Next?

Rebuilding this portfolio was a reminder that front-end engineering is all about details. Sure, I could have used a simple template, but writing custom pointer captures, math clamping viewport boundaries, and managing state stacks is where the fun is.

Go ahead—drag the windows around, resize them, toggle the languages, or open the terminal. Make yourself at home!
