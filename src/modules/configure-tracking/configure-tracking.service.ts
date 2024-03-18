import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import UpdateBuilder from 'src/submodules/common/builder/update.builder';
import { ConfigureTracking } from 'src/submodules/database/entities';
import { Repository } from 'typeorm';
import { UpdateTrackingDto } from './dto/configure-tracking.dto';

@Injectable()
export class ConfigTrackingService {
  constructor(
    @InjectRepository(ConfigureTracking)
    private configureTrackingRepo: Repository<ConfigureTracking>,
  ) {}

  async getOne() {
    const pc = await this.findPCByPk();
    return pc;
  }

  async update(body: UpdateTrackingDto) {
    const pc = (await this.findPCByPk()) || this.configureTrackingRepo.create();

    const dataUpdate = new UpdateBuilder(pc, body)
      .updateColumns([
        'warning',
        'allowedRadius',
        'regular',
        'timeCheckIn',
        'timeNormal',
      ])
      .getNewData();

    return await this.configureTrackingRepo.save(dataUpdate);
  }

  async findPCByPk() {
    const configTracking = await this.configureTrackingRepo
      .createQueryBuilder('configTracking')
      .getOne();

    return configTracking;
  }
}
