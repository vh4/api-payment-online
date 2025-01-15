import { Controller, Get } from '@nestjs/common'
import { AppService } from './app.service'

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService
  ) {}

  @Get()
  main(): object {
    return this.appService.Main()
  }

  @Get('/api/healthy')
  healthy(): object {
    return this.appService.Healthy()
  }

  @Get('/favicon.ico')
  handleFavicon(): void {
    return
  }
}
