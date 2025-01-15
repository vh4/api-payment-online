import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common'
import { Request } from 'express'
import { Observable, tap } from 'rxjs'

@Injectable()
export class SuccessInterceptor
  implements NestInterceptor
{
  private logger = new Logger(
    'SuccessInterceptor'
  )
  intercept(
    context: ExecutionContext,
    next: CallHandler
  ): Observable<any> {
    const request = context
      .switchToHttp()
      .getRequest<Request>()
    const mid = request.mid

    return next.handle().pipe(
      tap(() => {
        this.logger.warn(
          `success | ${mid} | request  | path => ${request.path}  -> ${JSON.stringify(request.body)}`
        )
        this.logger.warn(
          `success | ${mid} | response | path => ${request.path} -> ${JSON.stringify(request.response) ?? '-'}`
        )
      })
    )
  }
}
