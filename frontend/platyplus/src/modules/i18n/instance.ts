import VueI18n from 'vue-i18n'

let i18n: VueI18n
export const setI18n = (value: VueI18n) => (i18n = value)
export const getI18n = () => i18n
