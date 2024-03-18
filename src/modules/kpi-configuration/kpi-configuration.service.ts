import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import UpdateBuilder from 'src/submodules/common/builder/update.builder';
import { KpiConfiguration, User } from 'src/submodules/database/entities';
import { Repository } from 'typeorm';
import {
  GetKpiConfigurationDto,
  UpdateConfigKpiDto,
} from './dto/kpi-configuration.dto';

@Injectable()
export class KpiConfigureService {
  constructor(
    @InjectRepository(KpiConfiguration)
    private kpiConfigurationRepo: Repository<KpiConfiguration>,
  ) {}

  async getOne({ status }: GetKpiConfigurationDto) {
    const pc = await this.findPendingKpiConfigureByPk(status);
    return pc;
  }

  async update(body: UpdateConfigKpiDto, user: User) {
    const pc =
      (await this.findPendingKpiConfigureByPk(
        KpiConfiguration.STATUS.PENDING,
      )) || this.kpiConfigurationRepo.create();

    pc.creatorId = user.id;

    const dataUpdate = new UpdateBuilder(pc, body)
      .updateColumns(['mcpDay', 'applicationDate', 'visitingRoute'])
      .getNewData();

    return await this.kpiConfigurationRepo.save(dataUpdate);
  }

  async findPendingKpiConfigureByPk(status: number) {
    const configTracking = await this.kpiConfigurationRepo
      .createQueryBuilder('configTracking')
      .where('configTracking.status = :status', {
        status,
      })
      .getOne();

    return configTracking;
  }
}
