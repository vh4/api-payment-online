import {
  Injectable,
  NestMiddleware,
} from '@nestjs/common'
import { Request, Response } from 'express'
import { ErrorFormatService } from 'src/helpers/error-format/error-format.service'
import { HelpersService } from 'src/helpers/helpers.service'
import { MessageService } from 'src/helpers/messages/message.service'

@Injectable()
export class AuthMiddleware
  implements NestMiddleware
{
  constructor(
    private err: ErrorFormatService,
    private message: MessageService,
    private helpers: HelpersService
  ) {}
  async use(
    req: Request,
    res: Response,
    next: () => void
  ) {
    const fail =
      this.message.TransactionNotPermittedToTerminal()
    const auth =
      req.headers?.authorization || null

    if (!auth || !auth.startsWith('Bearer ')) {
      this.err.throwError(
        401,
        fail.responseCode,
        fail.responseMessage
      )
    }

    if (req.session.uid && req.session.pin) {
      return next()
    }

    const token = auth.replace(/^Bearer\s+/i, '')
    const { uid, pin } =
      await this.helpers.getUidPin(token)

    req.session.uid = uid
    req.session.pin = pin

    next()
  }
}
