import { CreateUserAccountFactory } from '@/main/factories/CreateUserAccountFactory'
import { ExpressControllerAdapter } from '@/main/express/adapter/ExpressControllerAdapter'

import { Router } from 'express'

export default (router: Router): void => {
  const factory = new CreateUserAccountFactory().makeControllerFactory()
  const request = ExpressControllerAdapter(factory)
  router.post('/account/create-users-accounts', request)
}
