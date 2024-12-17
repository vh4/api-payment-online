import { Injectable } from '@nestjs/common';
import { ErrorFormatService } from './error-format/error-format.service';
import axios, { AxiosResponse } from 'axios';
import { jwtDecode, JwtPayload } from 'jwt-decode';
import { MessageService } from './message/message.service';
import { MandatoryType } from 'src/inquiry/inquiry.dto';

interface ExtendedJwtPayload extends JwtPayload {
  data: string;
}

interface GetUidPinType {
  uid: string;
  pin: string;
}

@Injectable()
export class HelpersService {
  constructor(
    private readonly error: ErrorFormatService,
    private readonly message: MessageService,
  ) {}

  /**
   * Generate a unique transaction ID (MID).
   * @returns {string} - A unique 19-character string.
   */
  Mid(): string {
    const first = Date.now();
    const second = Math.floor((first % 1000) * 10)
      .toString()
      .padStart(2, '0');
    const third = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, '0');
    return `${first}${second}${third}`.slice(0, 19);
  }

  /**
   * Hit a specified URL with optional data payload.
   * @param {string} url - The URL to send the request to.
   * @param {object | null} data - The payload data for the POST request.
   * @returns {Promise<any>} - The response data.
   */
  async hitStukUrl(url: string, data: object | null): Promise<any> {
    try {
      const response: AxiosResponse = data
        ? await axios.post(url, data, { timeout: 60 * 1000 })
        : await axios.post(url, { timeout: 60 * 1000 });

      return response.data;
    } catch (error: any) {
      this.error.throwError(500, '03', error.message);
    }
  }

  /**
   * Decrypts a given token and retrieves its associated data.
   * @param {string} token - The JWT token to be decrypted.
   * @returns {Promise<string | undefined>} - The decrypted data.
   */
  async decryptToken(token: string): Promise<string | undefined> {
    const jwtDecoded = jwtDecode<ExtendedJwtPayload>(token);
    const resp = this.message.TransactionNotPermittedToTerminal();

    if (!jwtDecoded || !jwtDecoded.data) {
      this.error.throwError(401, resp.responseCode, resp.responseMessage);
    }

    const url = `${process.env.URL_AUTH_REDIRECT}/index.php?dekrip=null`;
    const response = await this.hitStukUrl(url, {
      dekrip: jwtDecoded.data,
    });

    return response;
  }

  /**
   * Extracts UID and PIN from a decrypted token.
   * @param {string} token - The JWT token to be decrypted.
   * @returns {Promise<GetUidPinType>} - An object containing UID and PIN.
   */
  async getUidPin(token: string): Promise<GetUidPinType> {
    const decrypt = await this.decryptToken(token);
    const resp = this.message.TransactionNotPermittedToTerminal();

    if (!decrypt || decrypt.trim() === '') {
      this.error.throwError(401, resp.responseCode, resp.responseMessage);
    }

    const [uid, pin] = decrypt.split('|');
    if (!uid || !pin) {
      this.error.throwError(401, resp.responseCode, resp.responseMessage);
    }

    return { uid, pin };
  }

  /**
   * Formats and returns a mandatory response structure.
   * @param {MandatoryType} data - The mandatory data to be formatted.
   * @returns {MandatoryType} - A formatted mandatory response.
   */
  mandatoryResponse(data: MandatoryType): MandatoryType {
    const mess = this.message.Success();

    return {
      responseCode: mess.responseCode,
      responseMessage: mess.responseMessage,
      kodeproduk: data.kodeproduk,
      tanggal: data.tanggal,
      idpel1: data.idpel1,
      idpel2: data.idpel2,
      idpel3: data.idpel3,
      nominal: data.nominal,
      admin: data.admin,
      id_outlet: data.id_outlet,
      pin: '-----',
      ref1: data.ref1,
      ref2: data.ref2,
      ref3: data.ref3,
      fee: data.fee,
      saldo_terpotong: data.saldo_terpotong,
      sisa_saldo: data.sisa_saldo,
      total_bayar: data.total_bayar,
      struk:`${process.env.RB_STRUK}/index.php/service?id=${data.ref2}`
    };
  }
}
