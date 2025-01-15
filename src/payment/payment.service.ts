import { Injectable } from '@nestjs/common'
import { HelpersService } from 'src/helpers/helpers.service'
import { ErrorFormatService } from 'src/helpers/error-format/error-format.service'
import { MandatoryTypePayment } from './payment.dto'
import {
  PlnPraTypePayment,
  PlnPaschTypePayment,
  PlnNonTypePayment,
  PaymentType,
} from './payment.dto'
import { PlnService } from 'src/helpers/services/pln/pln-helper.service'

@Injectable()
export class PaymentService {
  private readonly path = `${process.env.RB_URL}/api_partnerlink.php`

  constructor(
    private readonly helpers: HelpersService,
    private readonly plnHelpers: PlnService,
    private readonly err: ErrorFormatService
  ) {}
  async service(
    product: string,
    data: PaymentType
  ): Promise<MandatoryTypePayment> {
    const resp = (await this.helpers.hitStukUrl(
      this.path,
      data
    )) as MandatoryTypePayment

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
  ): PlnPraTypePayment {
    const totalBayar = (
      parseInt(resp.nominal) +
      parseInt(resp.biayaadmin)
    ).toString()

    const materai = this.helpers
      .getFloatValue(
        resp.stampduty,
        parseInt(resp.minorunitstampduty)
      )
      .toString()
    const ppn = this.helpers
      .getFloatValue(
        resp.ppn,
        parseInt(resp.minorunitppn)
      )
      .toString()
    const ppj = this.helpers
      .getFloatValue(
        resp.ppj,
        parseInt(resp.minorunitppj)
      )
      .toString()
    const angsuran = this.helpers
      .getFloatValue(
        resp.customerpayablesinstallment,
        parseInt(
          resp.minorunitcustomerpayablesinstallment
        )
      )
      .toString()

    return {
      nomormeter: resp.nomormeter,
      namapelanggan: resp.namapelanggan,
      tarif: resp.subscribersegmentation,
      daya: resp.powerconsumingcategory,
      noref: resp.noref1,
      nominal: resp.nominal,
      admin_bank: resp.biayaadmin,
      total_bayar: totalBayar,
      meterai: materai,
      ppn: ppn,
      pbjttl: ppj,
      angsuran: angsuran,
      totalkwh: resp.purchasedkwhunit,
      tokenpln: resp.tokenpln,
    }
  }

  /*
    PLN PASCHA BAYAR mapping response.
  */

  private formatPlnPaschData(
    resp: any
  ): PlnPaschTypePayment {
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
      parseInt(resp.biayaadmin)
    ).toString()

    return {
      nomormeter: resp.nomormeter,
      namapelanggan: resp.namapelanggan,
      tarif: resp.subscribersegmentation,
      daya: resp.powerconsumingcategory,
      total_lembar_tag: resp.totaloutstandingbill,
      blth: blth,
      stan_meter: stmeter,
      rp_tag_pln: resp.nominal,
      admin_bank: resp.biayaadmin,
      total_bayar: totalBayar,
    }
  }

  /*
    PLN PASCHA BAYAR mapping response.
  */

  private formatPlnNonData(
    resp: any
  ): PlnNonTypePayment {
    return {
      namapelanggan: resp.subscribername,
      registrationdate: resp.registrationdate,
      reff: resp.swrefnumber,
    }
  }
}
