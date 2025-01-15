import {
  Body,
  Controller,
  Header,
  HttpCode,
  Post,
  Req,
} from '@nestjs/common'
import { Request } from 'express'
import { UserAuthDto } from './dto/auth.dto'
import { ClientInfo } from 'src/decorator/user-agent/user-agent.decorator'
import { AuthService } from './auth.service'
import { MessageService } from 'src/helpers/messages/message.service'

@Controller('/api/auth')
export class AuthController {
  private success: {
    responseCode: string
    responseMessage: string
  }
  constructor(
    private readonly AuthServices: AuthService,
    message: MessageService
  ) {
    this.success = message.Success()
  }

  @Post()
  @HttpCode(200)
  @Header('Content-Type', 'application/json')
  async auth(
    @Req() req: Request,
    @Body() data: UserAuthDto,
    @ClientInfo() info: any
  ) {
    const response =
      await this.AuthServices.authLoginPost(
        data,
        info
      )

    req.response = response

    return {
      ...this.success,
      ...response,
    }
  }
}
