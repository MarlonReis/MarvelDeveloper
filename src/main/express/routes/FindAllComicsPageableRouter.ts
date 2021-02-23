import { ExpressControllerAdapter } from '@/main/express/adapter/ExpressControllerAdapter'
import { FindAllComicsPageableFactory } from '@/main/factories/comic/FindAllComicsPageableFactory'

import { Router } from 'express'

export default (router: Router): void => {
  const factory = new FindAllComicsPageableFactory().makeControllerFactory()
  const request = ExpressControllerAdapter(factory)
  router.get('/comics', request)
}
