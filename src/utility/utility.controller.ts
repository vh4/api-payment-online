import {
  Controller,
  Get,
  HttpCode,
  Req,
} from '@nestjs/common'
import { Request } from 'express'
import { GlobalSetting } from 'src/helpers/dto/global-setting.dto'
import { MessageService } from 'src/helpers/messages/message.service'
import { PlnService } from 'src/helpers/services/pln/pln-helper.service'

@Controller('/api/utility')
export class UtilityController {
  constructor(
    private helper: PlnService,
    private message: MessageService
  ) {}

  @Get('/list-product')
  @HttpCode(200)
  async ListProduct(
    @Req() req: Request
  ): Promise<
    Record<string, string | GlobalSetting[]>
  > {
    const sucess = this.message.Success()

    const response = {
      ...sucess,
      data: await this.helper.getProductGlobalSetting(),
    }

    req.response = response

    return response
  }
}
