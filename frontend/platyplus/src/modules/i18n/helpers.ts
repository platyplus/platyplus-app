/**
 * * Returns the simplified language code that is supported by Quasar and the application
 * E.g. Quasar uses 'en-us' but not 'en', and uses 'fr' but not 'fr-fr'
 * @param code the ISO language code e.g. fr-be, en, en-US
 */
export const languageCode = (code: string) => {
  code = code.toLocaleLowerCase()
  if (code.startsWith('en')) return 'en-us'
  if (code.startsWith('fr')) return 'fr'
  return code
}
