const FALLBACK_MS = 3000

export default (load) => {
  let started = false
  const start = async () => {
    if (started) return
    started = true
    observer?.disconnect()
    const hydrate = await load()
    await hydrate()
  }
  const painted = () => performance.getEntriesByName('first-contentful-paint').length > 0
  const observer =
    typeof PerformanceObserver === 'undefined'
      ? undefined
      : new PerformanceObserver(() => {
          if (painted()) void start()
        })
  if (painted()) return void start()
  observer?.observe({ type: 'paint', buffered: true })
  setTimeout(() => void start(), FALLBACK_MS)
}
