import { ExpressControllerAdapter } from '@/main/express/adapter/ExpressControllerAdapter'
import { CreateComicFactory } from '@/main/factories/comic/CreateComicFactory'

import { Router } from 'express'

export default (router: Router): void => {
  const factory = new CreateComicFactory().makeControllerFactory()
  const request = ExpressControllerAdapter(factory)
  router.post('/comics', request)
}
