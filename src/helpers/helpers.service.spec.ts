import type { TestingModule } from '@nestjs/testing'
import { Test } from '@nestjs/testing'
import { HelpersService } from './helpers.service'
import { ErrorFormatService } from './error-format/error-format.service'
import { MessageService } from './messages/message.service'

describe('HelpersService', () => {
  let service: HelpersService

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        imports: [],
        providers: [
          HelpersService,
          ErrorFormatService,
          MessageService,
        ],
      }).compile()

    service = module.get<HelpersService>(
      HelpersService
    )
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
