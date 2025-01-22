import { Injectable } from '@nestjs/common'
import { GlobalSetting } from 'src/helpers/dto/global-setting.dto'
import { HelperRepository } from 'src/helpers/helper.repository'

@Injectable()
export class PlnService {
  constructor(
    private readonly globalSettingRepository: HelperRepository
  ) {}

  /**
   * Formats and returns global setting structure.
   * @returns {GlobalSetting[]} - A formatted global setting response.
   */
  async getProductGlobalSetting(): Promise<
    GlobalSetting[]
  > {
    const data =
      await this.globalSettingRepository.findGlobalSettingsByProductKey()

    return data
  }

  /**
   * Function to get the abbreviated name of a month.
   * @param bln - Numeric representation of the month (1-12).
   * @returns {string} - Abbreviated month name or an empty string if the input is invalid.
   */
  getNamaBulan(bln: number): string {
    if (isNaN(bln) || bln < 1 || bln > 12) {
      return ''
    }

    const bulan = [
      'JAN',
      'FEB',
      'MAR',
      'APR',
      'MEI',
      'JUN',
      'JUL',
      'AGS',
      'SEP',
      'OKT',
      'NOV',
      'DES',
    ]

    return bulan[bln - 1]
  }

  /**
   * Function to transform a 'YYYYMM' formatted string into a 'MONTHYY' format.
   * @param blth - Input string in 'YYYYMM' format.
   * @returns {string} - A formatted string in 'MONTHYY' format or the original input if invalid.
   */
  getBlthFormat(blth: string): string {
    if (!blth || blth.length !== 6) {
      return blth
    }

    const monthPart = parseInt(
      blth.substring(4, 6),
      10
    )
    const yearPart = blth.substring(2, 4)

    const monthName = this.getNamaBulan(monthPart)

    return monthName
      ? `${monthName}${yearPart}`
      : blth
  }

  /**
   * Function to transform a like 'FEB12, MAR12, APR12'.
   * @param totalBill - Input number total bill periode.
   * @params arr - input array string like ['202412, '202410']
   * @returns {string} - A formatted string in 'MONTHYY' format or the original input if invalid.
   */

  getBlth(
    totalBill: number,
    arr: string[]
  ): string {
    let blth = ''

    for (let i = 0; i < totalBill; i++) {
      if (i > 0 && i < 4) {
        blth += ', '
      }

      blth += this.getBlthFormat(arr[i])
    }

    return blth
  }

  /**
   * Function to get the stand meter based on the bill count.
   * @param jumlahBill - The number of bills.
   * @param firstMeter - The first meter value to be used (SLALWBP1).
   * @param LastMeterArr - Array of last meter values (SAHLWBP1, SAHLWBP2, etc.).
   * @returns {string} - The formatted stand meter.
   */

  getStandMeter(
    jumlahBill: number,
    firstMeter: string,
    LastMeterArr: string[]
  ): string {
    let standMeter = firstMeter

    if (jumlahBill === 1) {
      standMeter += `-${LastMeterArr[0]}`
    } else if (jumlahBill === 2) {
      standMeter += `-${LastMeterArr[1]}`
    } else if (jumlahBill === 3) {
      standMeter += `-${LastMeterArr[2]}`
    } else if (jumlahBill === 4) {
      standMeter += `-${LastMeterArr[3]}`
    } else if (jumlahBill >= 5) {
      standMeter += `-${LastMeterArr[3]}`
    }

    return standMeter
  }
}
