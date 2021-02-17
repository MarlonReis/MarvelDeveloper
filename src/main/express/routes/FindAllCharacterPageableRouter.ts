import { ExpressControllerAdapter } from '@/main/express/adapter/ExpressControllerAdapter'

import { Router } from 'express'
import {
  FindAllCharacterPageableFactory
} from '@/main/factories/character/FindAllCharacterPageableFactory'

export default (router: Router): void => {
  const factory = new FindAllCharacterPageableFactory().makeControllerFactory()
  const request = ExpressControllerAdapter(factory)
  router.get('/characters', request)
}
