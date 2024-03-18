import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import FilterBuilder from 'src/submodules/common/builder/filter.builder';
import { ErrorHttpException } from 'src/submodules/common/exceptions/throw.exception';
import { listResponse } from 'src/submodules/common/response/response-list.response';
import { AppVersion, User } from 'src/submodules/database/entities';
import { Repository } from 'typeorm';
import { CreateVersionDto, HistoryVersionDto } from './dto/app-version.dto';

@Injectable()
export class AppVersionService {
  constructor(
    @InjectRepository(AppVersion)
    private versionRepo: Repository<AppVersion>,
  ) {}

  async getHistoryVersion(query: HistoryVersionDto) {
    const entity = {
      entityRepo: this.versionRepo,
      alias: 'version',
    };

    const filterBuilder = new FilterBuilder(entity, query)
      .addNumber('id')
      .addString('platform', query.platform)
      .addPagination()
      .sortBy('id');

    const [list, total] = await filterBuilder.getManyAndCount();
    return listResponse(list, total, query);
  }

  async getOne(platform: string) {
    if (
      platform !== AppVersion.PLATFORM.ANDROID &&
      platform !== AppVersion.PLATFORM.IOS
    ) {
      throw ErrorHttpException(HttpStatus.BAD_REQUEST, 'BAD_REQUEST');
    }
    return await this.findVersionByPk(platform);
  }

  async update(body: CreateVersionDto, creator: User) {
    const { platform, version, required, description } = body;
    await this.updateInactivePlatform(platform);

    const newVersion = this.versionRepo.create({
      platform,
      version,
      required,
      description,
      creatorId: creator.id,
    });

    return await this.versionRepo.save(newVersion);
  }

  async updateInactivePlatform(platform: string) {
    const activeVersion = await this.versionRepo.findOneBy({
      platform,
      status: AppVersion.STATUS.ACTIVE,
    });

    if (activeVersion) {
      activeVersion.status = AppVersion.STATUS.INACTIVE;
      await this.versionRepo.save(activeVersion);
    }
  }

  async findVersionByPk(platform: string) {
    const version = await this.versionRepo
      .createQueryBuilder('version')
      .select(['version', 'creator.id', 'creator.fullName', 'creator.email'])
      .leftJoin('version.creator', 'creator')
      .where('version.platform = :platform', { platform })
      .andWhere('version.status = :status', {
        status: AppVersion.STATUS.ACTIVE,
      })
      .getOne();

    return version;
  }
}
