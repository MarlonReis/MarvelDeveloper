import { Request, Response, NextFunction } from 'express'
export const cors = (req: Request, res: Response, next: NextFunction): void => {
  res.set('access-control-allow-origin', '*')
    .set('access-control-allow-method', '*')
    .set('access-control-allow-headers', '*')
  next()
}
