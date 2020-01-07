/**
 * Helpers that are used in the entire package
 */
import Handlebars from 'handlebars'

export const getHandlebarsVars = (value: string) => {
  const ast = Handlebars.parse(value)
  const result: string[] = []
  for (const i in ast.body) {
    if (ast.body[i].type === 'MustacheStatement') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const bodyElement = ast.body[i] as any
      result.push(bodyElement.path.original)
    }
  }
  return result
}
