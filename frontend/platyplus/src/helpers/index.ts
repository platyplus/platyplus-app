import { ObjectMap } from '../types/common'
export * from './icons'

interface Config {
  API?: string
}
export function getConfig() {
  const configString = localStorage.getItem('config')
  if (!configString) {
    let config: Config = {
      // ? will set a default on build or run time? What are the consequences for CI/CD
      API: process.env.API
    }
    if (process.env.PROD) {
      console.log('In production mode :)')
      const xhr = new XMLHttpRequest() // TODO: deprecated: move to async: Promise.resolve()? (found an example in https://kazupon.github.io/vue-i18n/guide/lazy-loading.html)
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

// https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore#_pick
export const pick = (object: ObjectMap, keys: string[]) =>
  keys.reduce<ObjectMap>((obj, key) => {
    if (object && object.hasOwnProperty(key)) {
      obj[key] = object[key]
    }
    return obj
  }, {})
