import { Controller, Get, HttpCode, Req } from '@nestjs/common';
import { Request } from 'express';
import { GlobalSetting } from 'src/helpers/dto/global-setting.dto';
import { HelpersService } from 'src/helpers/helpers.service';
import { MessageService } from 'src/helpers/message/message.service';

@Controller('/api/utility')
export class UtilityController {
	constructor(
		private helper: HelpersService,
		private message: MessageService
	){}

	@Get('/list-product')
	@HttpCode(200)
	async ListProduct(@Req() req: Request,): Promise<Record<string, string|GlobalSetting[]>>{
		const sucess = this.message.Success();
		const response =  {
			...sucess,
			data: await this.helper.getProductGlobalSetting()
		}
		
		req.response = response;
		return response;
	}

}
