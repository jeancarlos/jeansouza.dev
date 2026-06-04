;(function () {
  try {
    var s = localStorage.getItem('theme')
    var p =
      s === 'light' || s === 'dark'
        ? s
        : window.matchMedia('(prefers-color-scheme:light)').matches
          ? 'light'
          : 'dark'
    document.documentElement.setAttribute('data-theme', p)
  } catch (e) {
    document.documentElement.setAttribute('data-theme', 'dark')
  }
})()
