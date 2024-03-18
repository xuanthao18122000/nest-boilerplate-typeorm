import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import FilterBuilder from 'src/submodules/common/builder/filter.builder';
import { ErrorHttpException } from 'src/submodules/common/exceptions/throw.exception';
import { listResponse } from 'src/submodules/common/response/response-list.response';
import { ROU, User } from 'src/submodules/database/entities';
import { Repository } from 'typeorm';
import { LocationService } from '../location/location.service';
import {
  AssignRouToProvinceDto,
  CreateROUDto,
  ListROUDto,
} from './dto/rou.dto';

@Injectable()
export class ROUService {
  constructor(
    @InjectRepository(ROU)
    private readonly rouRepo: Repository<ROU>,

    private readonly locationService: LocationService,
  ) {}

  async getAll(query: ListROUDto) {
    const entity = {
      entityRepo: this.rouRepo,
      alias: 'rou',
    };

    const filterBuilder = new FilterBuilder(entity, query)
      .addLeftJoinAndSelect(['id', 'fullName', 'email'], 'creator')
      .addUnAccentString('name')
      .addNumber('id')
      .addNumber('status')
      .addDate('createdAt', 'createdDateFrom', 'createdDateTo')
      .addPagination()
      .sortBy('id');

    const [list, total] = await filterBuilder.getManyAndCount();
    return listResponse(list, total, query);
  }

  async create({ name, provinces }: CreateROUDto, creator: User) {
    const rou = this.rouRepo.create({ name, creatorId: creator.id });

    const newRou = await this.rouRepo.save(rou);

    await this.addRouToProvince(newRou.id, provinces);

    return newRou.serialize();
  }

  async assignRouToProvince({ name, provinces }: AssignRouToProvinceDto) {
    const rou = await this.rouRepo.findOneBy({ name });

    if (!rou) {
      throw ErrorHttpException(HttpStatus.NOT_FOUND, 'ROU_NOT_FOUND');
    }

    await this.addRouToProvince(rou.id, provinces);

    return rou;
  }

  async addRouToProvince(rouId: number, provinces: string[]) {
    if (provinces.length !== 0) {
      const locations = await this.locationService.getProvinceByNames(
        provinces,
      );

      if (locations.length !== provinces.length) {
        throw ErrorHttpException(HttpStatus.NOT_FOUND, 'PROVINCE_NOT_FOUND');
      }

      locations.forEach((location) => {
        location.rouId = rouId;
      });

      await this.locationService.saveLocations(locations);
    }
    return;
  }
}
