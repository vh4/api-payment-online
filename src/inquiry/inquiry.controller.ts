import { Body, Controller, HttpCode, Post, Req } from '@nestjs/common';
import { AuthType, InquiryType, InquiryValidator } from './inquiry.dto';
import { Auths } from 'src/decorator/auth/auth.decorator';
import { Request } from 'express';
import { InquiryService } from './inquiry.service';

@Controller('/api/inquiry')
export class InquiryController {
  private readonly mti = 'cek';

  constructor(private readonly inq: InquiryService) {}

  /**
   * Handle inquiry requests for various products.
   * 
   * @param {InquiryValidator} data - Inquiry payload containing `idpel` and `ref1`.
   * @param {AuthType} auth - Authentication data including `uid` and `pin`.
   * @param {Request} req - Express request object for logging purposes.
   * @returns {Promise<Record<string, string | object>>} - The response from the service.
   */
  @Post('/:product')
  @HttpCode(200)
  async handleInquiry(
    @Body() data: InquiryValidator,
    @Auths() auth: AuthType,
    @Req() req: Request,
  ): Promise<Record<string, string | object>> {
    const { product } = req.params;
    const inquiryParams: InquiryType = {
      method: this.mti,
      uid: auth.uid,
      pin: '----',
      produk: product.toUpperCase(),
      idpel: data.idpel,
      ref1: data.ref1,
    };

    if (product.toLocaleLowerCase() === 'plnpra30') {
      inquiryParams.nominal = data.nominal;
    }

    req.body = inquiryParams;
    inquiryParams.pin = auth.pin;
    const response = await this.inq.service(product, inquiryParams);
    req.response = response;
    return response;
  }
}
