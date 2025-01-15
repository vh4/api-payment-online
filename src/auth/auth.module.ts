import { Module } from '@nestjs/common'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { ErrorFormatService } from 'src/helpers/error-format/error-format.service'
import { MessageService } from 'src/helpers/messages/message.service'

@Module({
  imports: [],
  controllers: [AuthController],
  providers: [
    AuthService,
    ErrorFormatService,
    MessageService,
  ],
})
export class AuthModule {}
