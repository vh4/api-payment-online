import type { ExecutionContext } from '@nestjs/common'
import { createParamDecorator } from '@nestjs/common'
import type { Request } from 'express'

export const Auths = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const req = context
      .switchToHttp()
      .getRequest<Request>()

    return {
      uid: req.session.uid,
      pin: req.session.pin,
    }
  }
)
