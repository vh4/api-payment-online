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
import * as moment from 'moment'

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

    let pp: string|number =
      this.helpers.getFloatValue(
        resp.powerpurchase,
        resp.minorunitofpowerpurchase
      )
    let rpbayar =
      (
      parseFloat(resp.admin) +
      parseFloat(materai) +
      parseFloat(ppn) +
      parseFloat(ppj) +
      parseFloat(angsuran) +
      parseFloat(pp.toString())).toString()
      
      pp = pp.toString()

      const kata2 = 'Terima Kasih'
      const kata1 =
      'PLN Menyatakan Struk ini Sebagai Bukti Pembayaran yang Sah'

    return {
      nomormeter: resp.nomormeter,
      idpel: resp.idpel2,
      namapelanggan: resp.namapelanggan,
      tarif: resp.subscribersegmentation,
      daya: resp.powerconsumingcategory,
      noref: resp.noref1,
      rp_bayar: rpbayar,
      admin_bank:resp.admin,
      materai: materai,
      ppn: ppn,
      pbjttl: ppj,
      angsuran: angsuran,
      rp_token: pp,
      totalkwh: resp.purchasedkwhunit,
      tokenpln: resp.tokenpln,
      kata1: kata1,
      kata2:kata2,
      footer: resp.infotext,
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
      parseInt(resp.admin)
    ).toString()

    const kata2 = 'Terima Kasih'
    const kata1 =
    'PLN Menyatakan Struk ini Sebagai Bukti Pembayaran yang Sah'

    return {
      idpel: resp.idpel1,
      namapelanggan: resp.subscribername,
      tarif: resp.subscribersegmentation,
      daya: resp.powerconsumingcategory,
      blth: blth,
      stan_meter: stmeter,
      rp_tag_pln: resp.nominal,
      no_ref: resp.swreferencenumber,
      kata1: kata1,
      admin_bank: resp.admin,
      total_bayar: totalBayar,
      kata2: kata2,
      footer: resp.infoteks,
    }
  }

  /*
    PLN PASCHA BAYAR mapping response.
  */

  private formatPlnNonData(
    resp: any
  ): PlnNonTypePayment {
    const totalBayar = (
      parseInt(resp.nominal) +
      parseInt(resp.admin)
    ).toString()

    const kata1 =
      'PLN Menyatakan Struk ini Sebagai Bukti Pembayaran yang Sah'
    const footer = resp.infotext
    //20240305
    const registrationdate = moment(
      resp.registrationdate,
      'YYYYMMDD'
    ).format('DD MMM YYYY')

    return {
      transaksi: resp.transactionname,
      noregistration: resp.registrationnumber,
      registrationdate: registrationdate,
      namapelanggan: resp.subscribername,
      idpel: resp.subscriberid,
      noref: resp.swrefnumber,
      biaya_pln: resp.nominal,
      kata1: kata1,
      admin_bank: resp.admin,
      total_bayar: totalBayar,
      footer: footer,
    }
  }
}
