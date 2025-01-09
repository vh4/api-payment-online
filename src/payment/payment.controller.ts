import { Body, Controller, HttpCode, Post, Req } from '@nestjs/common';
import { Auths } from 'src/decorator/auth/auth.decorator';
import { Request } from 'express';
import { PaymentService } from './payment.service';
import { AuthType, PaymentType, PaymentValidator } from './payment.dto';

@Controller('/api/payment')
export class PaymentController {
  private readonly mti = 'bayar';

  constructor(private readonly pay: PaymentService) {}

  /**
   * Handle Payment requests for various products.
   * 
   * @param {PaymentValidator} data - Inquiry payload containing `idpel` and `ref1`.
   * @param {AuthType} auth - Authentication data including `uid` and `pin`.
   * @param {Request} req - Express request object for logging purposes.
   * @returns {Promise<Record<string, string | object>>} - The response from the service.
   */
  @Post('/:product')
  @HttpCode(200)
  async handlePayment(
    @Body() data: PaymentValidator,
    @Auths() auth: AuthType,
    @Req() req: Request,
  ): Promise<Record<string, string | object>> {
    const { product } = req.params;
    const paymentParams: PaymentType = {
      method: this.mti,
      uid: auth.uid,
      pin: '----',
      produk: product.toUpperCase(),
      idpel: data.idpel,
      ref1: data.ref1,
    };

    if (product.toLocaleLowerCase() === 'plnprah') {
		    paymentParams.nominal = data.nominal;
    }

    req.body = paymentParams;
    paymentParams.pin = auth.pin;
    const response = await this.pay.service(product, paymentParams);
    req.response = response;
    return response;
  }
}
