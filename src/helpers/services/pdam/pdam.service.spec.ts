import type { TestingModule } from '@nestjs/testing'
import { Test } from '@nestjs/testing'
import { PdamService } from './pdam.service'

describe('PdamService', () => {
  let service: PdamService

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        providers: [PdamService],
      }).compile()

    service = module.get<PdamService>(PdamService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
