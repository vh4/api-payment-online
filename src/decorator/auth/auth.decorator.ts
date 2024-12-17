import {
  createParamDecorator,
  SetMetadata,
  ExecutionContext,
} from '@nestjs/common';
import { Request } from 'express';

export const Auths = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const req = context.switchToHttp().getRequest<Request>();
    return {
      uid: req.uid,
      pin: req.pin,
    };
  },
);
