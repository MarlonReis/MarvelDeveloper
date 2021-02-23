import { Role } from '@/domain/model/user/AuthenticationData'
import { ExpressControllerAdapter } from '@/main/express/adapter/ExpressControllerAdapter'
import { AuthenticationMiddleware } from '@/main/factories/middlewares/AuthenticationMiddleware'
import {
  FindAllUserFavoriteComicsPageableFactory
} from '@/main/factories/user/FindAllUserFavoriteComicsPageableFactory'

import { Router } from 'express'

export default (router: Router): void => {
  const authMiddleware = new AuthenticationMiddleware().makeMiddlewareFactory(Role.USER)
  const factory = new FindAllUserFavoriteComicsPageableFactory().makeControllerFactory()
  const request = ExpressControllerAdapter(factory)
  router.get('/users/comics', authMiddleware, request)
}
