import { CreateUserAccountFactory } from '@/main/factories/CreateUserAccountFactory'
import { expressAdapter } from '@/main/express/adapter/ExpressControllerAdapter'

import { Router } from 'express'

export default (router: Router): void => {
  const factory = new CreateUserAccountFactory().makeControllerFactory()
  const request = expressAdapter(factory)
  router.post('/account/create-users-accounts', request)
}
