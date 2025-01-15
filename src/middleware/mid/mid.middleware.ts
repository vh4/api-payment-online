import {
  Injectable,
  NestMiddleware,
} from '@nestjs/common'
import { HelpersService } from 'src/helpers/helpers.service'

@Injectable()
export class MidMiddleware
  implements NestMiddleware
{
  constructor(
    private readonly mid: HelpersService
  ) {}
  use(req: any, res: any, next: () => void) {
    req.mid = this.mid.Mid()
    next() //
  }
}
