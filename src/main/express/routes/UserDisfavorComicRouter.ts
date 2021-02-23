import { AuthenticationMiddleware } from '@/main/factories/middlewares/AuthenticationMiddleware'
import { ExpressControllerAdapter } from '@/main/express/adapter/ExpressControllerAdapter'

import { Router } from 'express'
import { Role } from '@/domain/model/user/AuthenticationData'
import { UserDisfavorComicFactory } from '@/main/factories/user/UserDisfavorComicFactory'

export default (router: Router): void => {
  const authMiddleware = new AuthenticationMiddleware().makeMiddlewareFactory(Role.USER)

  const factory = new UserDisfavorComicFactory().makeControllerFactory()
  const request = ExpressControllerAdapter(factory)
  router.delete('/account/comics', authMiddleware, request)
}
