import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  ForbiddenException,
  HttpStatus,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { MainError } from 'src/helpers/error-format/error-format.service';
import { MessageService } from 'src/helpers/message/message.service';

@Catch()
export class ErrorFilter<T> implements ExceptionFilter {
  private logger = new Logger('ErrorFIlterHandler');
  constructor(private format: MessageService) {}
  catch(exception: any, host: ArgumentsHost) {
    const http = host.switchToHttp();
    const req = http.getRequest<Request>();
    const res = http.getResponse<Response>();
    let logger = 'error';

    let StatusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: object;
    if (exception instanceof MainError) {
      StatusCode = HttpStatus.BAD_REQUEST;
      message = {
        responseCode: exception.messageCode,
        responseMessage: exception.messageName,
      };
      logger = 'warn';
    } else if (exception instanceof TypeError) {
      StatusCode = HttpStatus.BAD_REQUEST;
      message = this.format.FormatError();
      logger = 'warn';
    } else if (exception instanceof ForbiddenException) {
      StatusCode = HttpStatus.FORBIDDEN;
      message = this.format.TransactionNotPermittedToTerminal();
      logger = 'warn';
    } else if (exception instanceof BadRequestException) {
      StatusCode = HttpStatus.BAD_REQUEST;
      message = this.format.BadRequest();
      logger = 'warn';
    } else if (exception instanceof UnauthorizedException) {
      StatusCode = HttpStatus.UNAUTHORIZED;
      message = this.format.TransactionNotPermittedToTerminal();
      logger = 'warn';
    } else {
      StatusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      message = this.format.SystemMalfunction();
      logger = 'error';
    }

    this.logger[logger](
      `error   | ${req.mid} | request  | path => ${req.path} -> header -> ${JSON.stringify(req.headers)} body -> ${JSON.stringify(req.body)}`,
    );
    this.logger[logger](
      `error   | ${req.mid} | message  | path => ${req.path} -> ${exception.message}`,
    );
    this.logger[logger](
      `error   | ${req.mid} | response | path => ${req.path} -> ${JSON.stringify(exception.response ?? '-')}`,
    );

    res.status(StatusCode).json({
      ...message,
      ...req.body,
      timestamp: req.timestamp,
    });
  }
}
