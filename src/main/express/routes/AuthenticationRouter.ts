
import { AuthenticationFactory } from '@/main/factories/authentication/AuthenticationFactory'
import { ExpressControllerAdapter } from '@/main/express/adapter/ExpressControllerAdapter'

import { Router } from 'express'

export default (router: Router): void => {
  const factory = new AuthenticationFactory().makeControllerFactory()
  const request = ExpressControllerAdapter(factory)
  router.post('/auth', request)
}
