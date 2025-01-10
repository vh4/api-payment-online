import { Test, TestingModule } from '@nestjs/testing';
import { HelpersService } from './helpers.service';
import { ErrorFormatService } from './error-format/error-format.service';
import { MessageService } from './message/message.service';
import { HelperRepository } from './helper.repository';
import { GlobalSetting } from './dto/global-setting.dto'; // Import your entity

describe('HelpersService', () => {
  let service: HelpersService;

  const mockHelpersRepository = {
    findGlobalSettingsByProductKey: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [
        HelpersService,
        ErrorFormatService,
        MessageService,
        {
          provide: HelperRepository,
          useValue: mockHelpersRepository,
        },
      ],
    }).compile();

    service = module.get<HelpersService>(HelpersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return data if global settings are found', async () => {
    const mockData: GlobalSetting[] = [
      {
        kunci: 'dev_saas',
        nilai: 'some_value',
        keterangan: 'some_description',
      },
    ];

    mockHelpersRepository.findGlobalSettingsByProductKey.mockResolvedValue(mockData);
    const response = await service.getProductGlobalSetting();

    expect(mockHelpersRepository.findGlobalSettingsByProductKey).toHaveBeenCalledTimes(1);
    expect(response).toEqual(mockData);
  });

});
