export function getConfig () {
  let conf = localStorage.getItem('config')
  if (!conf) {
    if (process.env.PROD) {
      var xhr = new XMLHttpRequest() // TODO: deprecated: move to async
      xhr.open('GET', `${window.location.origin}/config`, false)
      xhr.send()
      if (xhr.status === 200) {
        conf = JSON.parse(xhr.response)
      } else {
        console.error(xhr)
      }
    } else {
      conf = {
        API: process.env.API,
        AUTH_API: process.env.AUTH_API
      }
    }
    localStorage.setItem('config', conf)
  }
  return conf
}
