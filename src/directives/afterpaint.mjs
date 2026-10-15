export default (load) => {
  requestAnimationFrame(() => {
    setTimeout(async () => {
      const hydrate = await load()
      await hydrate()
    })
  })
}
