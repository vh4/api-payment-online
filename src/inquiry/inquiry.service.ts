import { Injectable } from '@nestjs/common';
import { HelpersService } from 'src/helpers/helpers.service';
import { InquiryType, MandatoryType, PlnNonType } from './inquiry.dto';
import { ErrorFormatService } from 'src/helpers/error-format/error-format.service';
import { PlnPraType, PlnPaschType } from './inquiry.dto';
import * as moment from 'moment';

@Injectable()
export class InquiryService {
  private readonly path = `${process.env.RB_URL}/api_partnerlink.php`;

  constructor(
    private readonly helpers: HelpersService,
    private readonly err: ErrorFormatService,
  ) {}

  /*
      service Inquiry => hit to url partner to getting response and mapping response for inquiry.
      you can adding new product in case to getting response by partner.
      by tony.
  */

  async service(product: string, data: InquiryType): Promise<MandatoryType> {
    const resp = (await this.helpers.hitStukUrl(
      this.path,
      data,
    )) as MandatoryType;

    if (resp.status !== '00') {
      this.err.throwError(400, resp.status, resp.keterangan);
    }

    const mandatory = this.helpers.mandatoryResponse(resp);

    switch (product.toLowerCase()) {
      case 'plnpra':
        mandatory.data = this.formatPlnPraData(resp);
        break;

      case 'plnpasch':
        mandatory.data = this.formatPlnPaschData(resp);
        break;

      case 'plnnon':
        mandatory.data = this.formatPlnNonData(resp);
        break;

      default:
        this.err.throwError(400, '03', `Unsupported product: ${product}`);
    }

    return mandatory;
  }

  /*
      For custom format by product => any product custom, you can custom in the below.
      please create new function to create new custom product.
      by => tony.
  */

  /*
    PLN PRABAYAR mapping response.
  */

  private formatPlnPraData(resp: any): PlnPraType {
    return {
      nomormeter: resp.nomormeter,
      namapelanggan: resp.subscribername,
      tarif: resp.subscribersegmentation,
      daya: resp.powerconsumingcategory,
    };
  }

  /*
    PLN PASCHA BAYAR mapping response.
  */

  private formatPlnPaschData(resp: any): PlnPaschType {
    return {
      namapelanggan: resp.subscribername,
      tarif: resp.subscribersegmentation,
      daya: resp.powerconsumingcategory,
      blth: moment(resp.blth1, 'YYYYMM').format('YYYY MMM'),
      standmeter: `${resp.slalwbp1}-${resp.sahlwbp1}`,
    };
  }

  /*
    PLN PASCHA BAYAR mapping response.
  */

  private formatPlnNonData(resp: any): PlnNonType {
    return {
      namapelanggan: resp.subscribername,
      registrationdate: resp.registrationdate,
      reff: resp.swrefnumber,
    };
  }
}
