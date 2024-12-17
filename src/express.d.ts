import { Request } from 'express';
declare module 'express' {
  export interface Request {
    useragent: object;
    mid: string;
    timestamp: Date | string;
    response?: object;
    uid?: string;
    pin?: string;
  }
}

export {};
