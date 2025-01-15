import { Injectable } from '@nestjs/common'

@Injectable()
export class AppService {
  Healthy(): object {
    return {
      response_code: '00',
      response_message: 'Success /healthy.',
    }
  }
  Main(): object {
    return {
      response_code: '00',
      response_message:
        'welcome to v1.0 API saas-ppob.',
    }
  }
}
