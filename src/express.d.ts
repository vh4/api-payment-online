declare module 'express' {
  export interface Request {
    useragent: object
    mid: string
    timestamp: Date | string
    response?: object
    session: {
      uid?: string
      pin?: string
    }
  }
}

export {}
