import { Express, Router } from 'express'
import { readdirSync } from 'fs'
import path from 'path'

export default (app: Express): void => {
  const router = Router()
  app.use('/api', router)

  readdirSync(path.join(__dirname, '/../routes'))
    .filter(file => !file.endsWith('.map'))
    .forEach(async file => (await import(`../routes/${file}`)).default(router))
}
