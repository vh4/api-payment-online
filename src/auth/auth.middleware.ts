import { Injectable, NestMiddleware, Body } from '@nestjs/common';
import { Request, Response } from 'express';
import { ErrorFormatService } from 'src/helpers/error-format/error-format.service';
import { HelpersService } from 'src/helpers/helpers.service';
import { MessageService } from 'src/helpers/message/message.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private err: ErrorFormatService,
    private message: MessageService,
    private helpers: HelpersService,
  ) {}
  async use(req: Request, res: Response, next: () => void) {
    const fail = this.message.TransactionNotPermittedToTerminal();
    const auth = req.headers.authorization;

    if (!auth || !auth.startsWith('Bearer ')) {
      this.err.throwError(401, fail.responseCode, fail.responseMessage);
    }

    const token = auth.replace(/^Bearer\s+/i, '');
    const { uid, pin } = await this.helpers.getUidPin(token);
    req.uid = uid;
    req.pin = pin;

    next();
  }
}
