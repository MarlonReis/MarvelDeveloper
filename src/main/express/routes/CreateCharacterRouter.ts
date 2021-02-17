import { CreateCharacterFactory } from '@/main/factories/character/CreateCharacterFactory'
import { ExpressControllerAdapter } from '@/main/express/adapter/ExpressControllerAdapter'

import { Router } from 'express'

export default (router: Router): void => {
  const factory = new CreateCharacterFactory().makeControllerFactory()
  const request = ExpressControllerAdapter(factory)
  router.post('/characters', request)
}
