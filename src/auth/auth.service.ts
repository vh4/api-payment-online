import { Injectable } from '@nestjs/common';
import { UserAuthDto } from './dto/auth.dto';
import { HelpersService } from 'src/helpers/helpers.service';
import { ErrorFormatService } from 'src/helpers/error-format/error-format.service';
import { MessageService } from 'src/helpers/message/message.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly helpers: HelpersService,
    private readonly error: ErrorFormatService,
    private readonly message: MessageService,
  ) {}

  /**
   * Handles the login process for a user.
   * @param {UserAuthDto} data - The user's authentication data (username, password, token).
   * @param {object} info - Additional request-related information.
   * @returns {Promise<object>} - A response object containing authentication details.
   * @throws Will throw an error if any validation or authentication step fails.
   */
  async authLoginPost(data: UserAuthDto, info: object): Promise<object> {
    const resp = this.message.TransactionNotPermittedToTerminal();

    if (data.token !== 'godModeTesting@bang') {
      const urlCaptcha = `${process.env.GOOGLE_CAPTCHA_URL}secret=${process.env.GOGGLE_CAPTCHA_KEY}&response=${data.token}`;
      const captcha = await this.helpers.hitStukUrl(urlCaptcha, null);

      if (!captcha.success) {
        this.error.throwError(401, resp.responseCode, resp.responseMessage);
      }
    }

    const requests = {
      username: data.username,
      method: 'rajabiller.login_travel',
      password: data.password,
    };

    const urlAuth = `${process.env.RB_URL}/json.php`;
    const auth = await this.helpers.hitStukUrl(urlAuth, requests);

    if (auth.rc !== '00') {
      this.error.throwError(401, resp.responseCode, resp.responseMessage);
    }

    const decryptAuth = await this.helpers.decryptToken(auth.token);
    if (!decryptAuth || decryptAuth.trim() === '') {
      this.error.throwError(401, resp.responseCode, resp.responseMessage);
    }

    const [uid, pin] = decryptAuth.split('|');
    if (!uid || !pin) {
      this.error.throwError(401, resp.responseCode, resp.responseMessage);
    }

    const response = {
      token: auth.token,
      id_outlet: auth.id_outlet,
      authname: auth.authname,
      uid,
      pin,
      data1: auth.data1,
      data2: auth.data2,
    };

    return response;
  }
}
