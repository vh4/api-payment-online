import { Global, Module } from '@nestjs/common'
import { HelpersService } from './helpers.service'
import { ErrorFormatService } from './error-format/error-format.service'
import { MessageService } from './messages/message.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { HelperRepository } from './helper.repository'
import { GlobalSetting } from './model/global-setting.model'
import { PlnService } from './services/pln/pln-helper.service'
import { PdamService } from './services/pdam/pdam.service'

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([GlobalSetting]),
  ],
  providers: [
    HelpersService,
    ErrorFormatService,
    MessageService,
    HelperRepository,
    PlnService,
    PdamService,
  ],
  exports: [
    HelpersService,
    MessageService,
    ErrorFormatService,
    PlnService,
    PdamService,
  ],
})
export class HelpersModule {}
