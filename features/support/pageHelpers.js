const createBrowserMonkey = require('browser-monkey/iframe')

module.exports = {
  navigateTo (url) {
    const page = createBrowserMonkey(url)
    page.set({timeout: process.env.BM_TIMEOUT || 3000})
    return page
  },

  reloadPage (page) {
    page._selector.contentWindow.location.reload()
  },
}
