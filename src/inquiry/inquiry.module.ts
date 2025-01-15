import { Module } from '@nestjs/common'
import { InquiryController } from './inquiry.controller'
import { InquiryService } from './inquiry.service'

@Module({
  providers: [InquiryService],
  controllers: [InquiryController],
})
export class InquiryModule {}
