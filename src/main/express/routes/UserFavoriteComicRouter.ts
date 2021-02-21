import { AuthenticationMiddleware } from '@/main/factories/middlewares/AuthenticationMiddleware'
import { ExpressControllerAdapter } from '@/main/express/adapter/ExpressControllerAdapter'

import { Router } from 'express'
import { Role } from '@/domain/model/user/AuthenticationData'
import { UserFavoriteComicFactory } from '@/main/factories/user/UserFavoriteComicFactory'

export default (router: Router): void => {
  const authMiddleware = new AuthenticationMiddleware().makeMiddlewareFactory(Role.USER)

  const factory = new UserFavoriteComicFactory().makeControllerFactory()
  const request = ExpressControllerAdapter(factory)
  router.post('/account/comics', authMiddleware, request)
}
