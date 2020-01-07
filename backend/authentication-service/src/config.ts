export const PUBLIC_KEY: string = (process.env.PUBLIC_KEY || '').replace(
  /\\n/g,
  '\n'
)
export const PRIVATE_KEY = (process.env.PRIVATE_KEY || '').replace(/\\n/g, '\n')
export const ALGORITHM = process.env.ALGORITHM || 'RS256'
export const EXPIRES_IN = process.env.EXPIRES_IN || '15m'
export const KID = '97fcbca368fe77808830c8100121ec7bde22cf0e' // TODO customize
