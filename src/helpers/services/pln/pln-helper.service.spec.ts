import type { TestingModule } from '@nestjs/testing'
import { Test } from '@nestjs/testing'
import { PlnService } from './pln-helper.service'
import type { GlobalSetting } from 'src/helpers/dto/global-setting.dto'
import { HelperRepository } from 'src/helpers/helper.repository'

describe('PlnService', () => {
  let service: PlnService

  const mockHelpersRepository = {
    findGlobalSettingsByProductKey: jest.fn(),
  }

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        providers: [
          PlnService,
          {
            provide: HelperRepository,
            useValue: mockHelpersRepository,
          },
        ],
      }).compile()

    service = module.get<PlnService>(PlnService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  it('should return data if global settings are found', async () => {
    const mockData: GlobalSetting[] = [
      {
        kunci: 'dev_saas',
        nilai: 'some_value',
        keterangan: 'some_description',
      },
    ]

    mockHelpersRepository.findGlobalSettingsByProductKey.mockResolvedValue(
      mockData
    )
    const response =
      await service.getProductGlobalSetting()

    expect(
      mockHelpersRepository.findGlobalSettingsByProductKey
    ).toHaveBeenCalledTimes(1)
    expect(response).toEqual(mockData)
  })

  it('should return data if pln getBLTH exists', () => {
    const arr = ['202411', '202412']

    const totalBill1 = 1
    const totalBill2 = 2

    const response1 = service.getBlth(
      totalBill1,
      arr
    )

    expect(response1).toBe('NOV24')

    const response2 = service.getBlth(
      totalBill2,
      arr
    )

    expect(response2).toBe('NOV24,DES24')
  })
})
