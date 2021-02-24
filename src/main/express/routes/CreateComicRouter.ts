import { Role } from '@/domain/model/user/AuthenticationData'
import { ExpressControllerAdapter } from '@/main/express/adapter/ExpressControllerAdapter'
import { CreateComicFactory } from '@/main/factories/comic/CreateComicFactory'
import { AuthenticationMiddleware } from '@/main/factories/middlewares/AuthenticationMiddleware'

import { Router } from 'express'

export default (router: Router): void => {
  const authMiddleware = new AuthenticationMiddleware().makeMiddlewareFactory(Role.USER)

  const factory = new CreateComicFactory().makeControllerFactory()
  const request = ExpressControllerAdapter(factory)
  router.post('/comics', authMiddleware, request)
}
