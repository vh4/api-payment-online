import { Global, Module } from '@nestjs/common';
import { HelpersService } from './helpers.service';
import { ErrorFormatService } from './error-format/error-format.service';
import { MessageService } from './message/message.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HelperRepository } from './helper.repository';
import { GlobalSetting } from './model/global-setting.entity';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([GlobalSetting])],
  providers: [
    HelpersService,
    ErrorFormatService,
    MessageService,
    HelperRepository,
  ],
  exports: [HelpersService, MessageService, ErrorFormatService],
})
export class HelpersModule {}
