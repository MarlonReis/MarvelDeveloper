import { ExpressControllerAdapter } from '@/main/express/adapter/ExpressControllerAdapter'

import { Router } from 'express'
import {
  FindComicByIdFactory
} from '@/main/factories/comic/FindComicByIdFactory'

export default (router: Router): void => {
  const factory = new FindComicByIdFactory().makeControllerFactory()
  const request = ExpressControllerAdapter(factory)
  router.get('/comics/:id', request)
}
