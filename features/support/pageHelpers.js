const createBrowserMonkey = require('browser-monkey/iframe')

module.exports = {
  navigateTo (url) {
    const page = createBrowserMonkey(url)
    page.set({timeout: process.env.BM_TIMEOUT || 3000})
    return page
  },

  reloadPage (page) {
    return new Promise((resolve, reject) => {
      const iframe = page._selector

      iframe.addEventListener('load', resolve, {once: true})
      iframe.contentWindow.location.reload()
    })
  }
}
