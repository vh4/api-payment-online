import { Injectable } from '@nestjs/common'

@Injectable()
export class ErrorFormatService {
  /**
   * Throws a custom error with the given details.
   * @param status HTTP status code
   * @param response_code Application-specific response code
   * @param response_message Error message
   */
  throwError(
    status: number,
    response_code: string,
    response_message: string
  ): void {
    throw new MainError(
      status,
      response_code,
      response_message
    )
  }
}

export class MainError extends Error {
  public statusCode: number
  public messageName: string
  public messageCode: string

  constructor(
    statusCode: number,
    messageCode: string,
    messageName: string
  ) {
    super(messageName)
    this.statusCode = statusCode
    this.messageCode = messageCode
    this.messageName = messageName
    this.name = this.constructor.name

    if (Error.captureStackTrace) {
      Error.captureStackTrace(
        this,
        this.constructor
      )
    }
  }
}
