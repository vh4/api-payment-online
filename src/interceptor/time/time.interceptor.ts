import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common'
import { Request } from 'express'
import * as moment from 'moment'
import { Observable } from 'rxjs'

@Injectable()
export class TimeInterceptor
  implements NestInterceptor
{
  intercept(
    context: ExecutionContext,
    next: CallHandler
  ): Observable<any> {
    const req = context
      .switchToHttp()
      .getRequest<Request>()

    req.timestamp = moment().format(
      'YYYY-MM-DD HH:mm:ss.SSS'
    )

    return next.handle()
  }
}
