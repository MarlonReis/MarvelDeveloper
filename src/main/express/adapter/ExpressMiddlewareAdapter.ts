
import { NextFunction, Request, Response } from 'express'

import { Middleware } from '@/presentation/protocols/Middleware'
import { HttpRequest, HttpResponse } from '@/presentation/protocols/Http'

export const ExpressMiddlewareAdapter = (middleware: Middleware) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const request: HttpRequest = { headers: req.headers }

    const response: HttpResponse = await middleware.handle(request)

    if (response.statusCode === 200 || response.statusCode === 201) {
      Object.assign(req, response.body)
      next()
    } else {
      res.status(response.statusCode).json({
        error: response.body.constructor.name,
        message: response.body.message
      })
    }
  }
}
