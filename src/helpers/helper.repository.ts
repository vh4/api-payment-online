import { Repository } from 'typeorm'
import { GlobalSetting } from './model/global-setting.model'
import { InjectRepository } from '@nestjs/typeorm'

export class HelperRepository {
  constructor(
    @InjectRepository(GlobalSetting)
    private readonly globalSettingRepository: Repository<GlobalSetting>
  ) {}

  async findGlobalSettingsByProductKey(): Promise<
    GlobalSetting[]
  > {
    return this.globalSettingRepository.find()
  }
}
