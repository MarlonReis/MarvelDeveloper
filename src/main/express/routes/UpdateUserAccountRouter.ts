import { UpdateUserAccountFactory } from '@/main/factories/user/UpdateUserAccountFactory'
import { ExpressControllerAdapter } from '@/main/express/adapter/ExpressControllerAdapter'

import { Router } from 'express'

export default (router: Router): void => {
  const factory = new UpdateUserAccountFactory().makeControllerFactory()
  const request = ExpressControllerAdapter(factory)
  router.put('/account', request)
}
