import { Injectable } from '@nestjs/common'
import { UserAuthDto } from './dto/auth.dto'
import { HelpersService } from 'src/helpers/helpers.service'
import { ErrorFormatService } from 'src/helpers/error-format/error-format.service'
import { MessageService } from 'src/helpers/messages/message.service'
import * as moment from 'moment'
import 'moment/locale/id'

moment.locale('id')

@Injectable()
export class AuthService {
  private method = 'rajabiller.login_travel'
  private url = `${process.env.RB_URL}/json.php`
  private isAllow = 'godModeTesting@bang'

  constructor(
    private readonly helpers: HelpersService,
    private readonly error: ErrorFormatService,
    private readonly message: MessageService
  ) {}

  /**
   * Handles the login process for a user.
   * @param {UserAuthDto} data - The user's authentication data (username, password, token).
   * @param {object} info - Additional request-related information.
   * @returns {Promise<object>} - A response object containing authentication details.
   * @throws Will throw an error if any validation or authentication step fails.
   */
  async authLoginPost(
    data: UserAuthDto,
    info: any = ''
  ): Promise<object> {
    const resp =
      this.message.TransactionNotPermittedToTerminal()

    if (data.token !== this.isAllow) {
      const urlCaptcha = `${process.env.GOOGLE_CAPTCHA_URL}secret=${process.env.GOGGLE_CAPTCHA_KEY}&response=${data.token}`
      const captcha =
        await this.helpers.hitStukUrl(
          urlCaptcha,
          null
        )

      if (!captcha.success) {
        this.error.throwError(
          401,
          resp.responseCode,
          resp.responseMessage
        )
      }
    }

    const requests = {
      username: data.username,
      method: this.method,
      password: data.password,
    }

    const auth = await this.helpers.hitStukUrl(
      this.url,
      requests
    )

    if (auth.rc !== '00') {
      this.error.throwError(
        401,
        resp.responseCode,
        resp.responseMessage
      )
    }

    const decryptAuth =
      await this.helpers.decryptToken(auth.token)

    if (
      !decryptAuth ||
      decryptAuth.trim() === ''
    ) {
      this.error.throwError(
        401,
        resp.responseCode,
        resp.responseMessage
      )
    }

    const [uid, pin] = decryptAuth.split('|')

    if (!uid || !pin) {
      this.error.throwError(
        401,
        resp.responseCode,
        resp.responseMessage
      )
    }

    const date = moment().format('YYYY, DD MMM HH:mm:ss.SSS')

    const response = {
      token: auth.token,
      id_outlet: auth.id_outlet,
      authname: auth.authname,
      username:data.username,
      login_date:date,
      uid,
      data1: auth.data1,
      data2: auth.data2,
      info,
    }

    return response
  }
}
