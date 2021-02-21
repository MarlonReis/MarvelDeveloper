import { CreateCharacterFactory } from '@/main/factories/character/CreateCharacterFactory'
import { ExpressControllerAdapter } from '@/main/express/adapter/ExpressControllerAdapter'

import { Router } from 'express'
import { AuthenticationMiddleware } from '@/main/factories/middlewares/AuthenticationMiddleware'
import { Role } from '@/domain/model/user/AuthenticationData'

export default (router: Router): void => {
  const authMiddleware = new AuthenticationMiddleware().makeMiddlewareFactory(Role.ADMIN)

  const factory = new CreateCharacterFactory().makeControllerFactory()
  const request = ExpressControllerAdapter(factory)
  router.post('/characters', authMiddleware, request)
}
