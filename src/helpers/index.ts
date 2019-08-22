interface Config {
  API?: string
}
export function getConfig() {
  const configString = localStorage.getItem('config')
  if (!configString) {
    let config: Config = {
      API: process.env.API
    }
    if (process.env.PROD) {
      const xhr = new XMLHttpRequest() // TODO: deprecated: move to async
      xhr.open('GET', `${window.location.origin}/config`, false)
      xhr.send()
      if (xhr.status === 200) {
        config = JSON.parse(xhr.response)
      } else {
        console.error(xhr)
      }
    }
    localStorage.setItem('config', JSON.stringify(config))
    return config
  } else return JSON.parse(configString)
}
