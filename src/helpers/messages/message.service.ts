import { Injectable } from '@nestjs/common'

@Injectable()
export class MessageService {
  Custom(
    responseCode: string,
    responseMessage: string
  ) {
    return {
      responseMessage: responseMessage,
      responseCode,
    }
  }
  Success() {
    return {
      responseMessage: 'completed successfully',
      responseCode: '00',
    }
  }
  SystemMalfunction() {
    return {
      responseMessage:
        'System malfunction / system error',
      responseCode: '96',
    }
  }
  FormatError() {
    return {
      responseMessage: 'Format error in Code',
      responseCode: '30',
    }
  }
  BadRequest() {
    return {
      responseMessage: 'Bad Request Exception',
      responseCode: '44',
    }
  }
  TransactionNotPermittedToTerminal() {
    return {
      responseMessage:
        'Transaction not permitted to terminal',
      responseCode: '58',
    }
  }
}
