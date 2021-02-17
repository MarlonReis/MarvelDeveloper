import { ExpressControllerAdapter } from '@/main/express/adapter/ExpressControllerAdapter'

import { Router } from 'express'
import {
  FindCharacterByIdFactory
} from '@/main/factories/character/FindCharacterByIdFactory'

export default (router: Router): void => {
  const factory = new FindCharacterByIdFactory().makeControllerFactory()
  const request = ExpressControllerAdapter(factory)
  router.get('/characters/:id', request)
}
