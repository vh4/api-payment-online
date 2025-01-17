import { Injectable } from '@nestjs/common'
import { HelpersService } from 'src/helpers/helpers.service'
import {
  InquiryType,
  MandatoryTypeInquiry,
  PlnNonTypeInquiry,
} from './inquiry.dto'
import { ErrorFormatService } from 'src/helpers/error-format/error-format.service'
import {
  PlnPraTypeInquiry,
  PlnPaschTypeInquiry,
} from './inquiry.dto'
import { PlnService } from 'src/helpers/services/pln/pln-helper.service'

@Injectable()
export class InquiryService {
  private readonly path = `${process.env.RB_URL}/api_partnerlink.php`

  constructor(
    private readonly helpers: HelpersService,
    private readonly plnHelpers: PlnService,
    private readonly err: ErrorFormatService
  ) {}

  /*
      service Inquiry => hit to url partner to getting response and mapping response for inquiry.
      you can adding new product in case to getting response by partner.
      by tony.
  */

  async service(
    product: string,
    data: InquiryType
  ): Promise<MandatoryTypeInquiry> {
    const resp = (await this.helpers.hitStukUrl(
      this.path,
      data
    )) as MandatoryTypeInquiry

    if (resp.status !== '00') {
      this.err.throwError(
        400,
        resp.status,
        resp.keterangan
      )
    }

    const mandatory =
      this.helpers.mandatoryResponse(resp)
    let products = product.toLowerCase()

    if (products.substring(0, 6) === 'plnpra') {
      products = 'plnprah'
    } else if (
      products.substring(0, 6) === 'plnnon'
    ) {
      products = 'plnnonh'
    }

    switch (products) {
      case 'plnprah':
        mandatory.data =
          this.formatPlnPraData(resp)
        break

      case 'plnpasch':
        mandatory.data =
          this.formatPlnPaschData(resp)
        break

      case 'plnnonh':
        mandatory.data =
          this.formatPlnNonData(resp)
        break

      default:
        this.err.throwError(
          400,
          '03',
          `Unsupported product: ${product}`
        )
    }

    return mandatory
  }

  /*
      For custom format by product => any product custom, you can custom in the below.
      please create new function to create new custom product.
      by => tony.
  */

  /*
    PLN PRABAYAR mapping response.
  */

  private formatPlnPraData(
    resp: any
  ): PlnPraTypeInquiry {
    return {
      nomormeter: resp.nomormeter,
      idpel: resp.idpelanggan,
      namapelanggan: resp.namapelanggan,
      tarif: resp.subscribersegmentation,
      daya: resp.powerconsumingcategory,
    }
  }

  /*
    PLN PASCHA BAYAR mapping response.
  */

  private formatPlnPaschData(
    resp: any
  ): PlnPaschTypeInquiry {
    //// params => billstatus, arr bill
    const blth = this.plnHelpers.getBlth(
      parseInt(resp.billstatus, 10),
      [
        resp.blth1,
        resp.blth2,
        resp.blth3,
        resp.blth4,
      ]
    ) as string

    const stmeter = this.plnHelpers.getStandMeter(
      parseInt(resp.billstatus, 10),
      resp.slalwbp1,
      [
        resp.sahlwbp1,
        resp.sahlwbp2,
        resp.sahlwbp3,
        resp.sahlwbp4,
      ]
    ) as string

    const totalBayar = (
      parseInt(resp.nominal) +
      parseInt(resp.admin)
    ).toString()
    const totalLembarTag = `${parseInt(resp.totaloutstandingbill)} Bulan`

    return {
      idpel: resp.idpel1,
      namapelanggan: resp.subscribername,
      total_lembar_tag: totalLembarTag,
      blth: blth,
      stan_meter: stmeter,
      rp_tag_pln: resp.nominal,
      admin_bank: resp.admin,
      total_bayar: totalBayar,
    }
  }

  /*
    PLN PASCHA BAYAR mapping response.
  */

  private formatPlnNonData(
    resp: any
  ): PlnNonTypeInquiry {
    const totalBayar = (
      parseInt(resp.nominal) +
      parseInt(resp.admin)
    ).toString()

    return {
      transaksi: resp.transactionname,
      noregistration: resp.registrationnumber,
      namapelanggan: resp.subscribername,
      biaya_pln: resp.nominal,
      admin_bank: resp.admin,
      total_bayar: totalBayar,
    }
  }
}
