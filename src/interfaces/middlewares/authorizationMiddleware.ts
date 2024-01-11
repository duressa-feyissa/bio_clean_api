import { NextFunction, Response } from 'express'

export default function authorization(roles: string[]) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (req: any, res: Response, next: NextFunction) => {
    if (roles.includes(req.user._doc.role)) {
      next()
    } else {
      res.status(403).send({
        message: "You don't have permission to access this resource",
        status: 403,
      })
    }
  }
}
