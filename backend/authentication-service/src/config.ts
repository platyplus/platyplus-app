export const PUBLIC_KEY: string = (process.env.PUBLIC_KEY || '').replace(
  /\\n/g,
  '\n'
)
export const PRIVATE_KEY = (process.env.PRIVATE_KEY || '').replace(/\\n/g, '\n')
export const ALGORITHM = process.env.ALGORITHM || 'RS256'
