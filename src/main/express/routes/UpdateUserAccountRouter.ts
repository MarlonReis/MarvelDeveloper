import { AuthenticationMiddleware } from '@/main/factories/middlewares/AuthenticationMiddleware'
import { UpdateUserAccountFactory } from '@/main/factories/user/UpdateUserAccountFactory'
import { ExpressControllerAdapter } from '@/main/express/adapter/ExpressControllerAdapter'

import { Router } from 'express'
import { Role } from '@/domain/model/user/AuthenticationData'
import { ExpressMiddlewareAdapter } from '@/main/express/adapter/ExpressMiddlewareAdapter'

export default (router: Router): void => {
  const authMiddleware = new AuthenticationMiddleware().makeMiddlewareFactory(Role.USER)
  const adapter = ExpressMiddlewareAdapter(authMiddleware)
  const factory = new UpdateUserAccountFactory().makeControllerFactory()
  const request = ExpressControllerAdapter(factory)
  router.put('/account', adapter, request)
}
