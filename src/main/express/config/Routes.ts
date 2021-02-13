import { Express, Router } from 'express'
import fg from 'fast-glob'

export default (app: Express): void => {
  const router = Router()
  app.use('/api', router)

  const files = fg.sync('**/src/main/express/routes/*.ts')
  files.map(async file => {
    const route = (await import(`../../../../${file}`)).default
    route(router)
  })
}
