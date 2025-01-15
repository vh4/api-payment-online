import {
  Injectable,
  NestMiddleware,
} from '@nestjs/common'
import * as useragent from 'express-useragent'

@Injectable()
export class UserAgentMiddleware
  implements NestMiddleware
{
  use(req: any, res: any, next: () => void) {
    req.useragent = useragent.parse(
      req.headers['user-agent']
    )
    next()
  }
}
