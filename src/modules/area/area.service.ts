import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import FilterBuilder from 'src/submodules/common/builder/filter.builder';
import { ErrorHttpException } from 'src/submodules/common/exceptions/throw.exception';
import { listResponse } from 'src/submodules/common/response/response-list.response';
import {
  ActivityLogDetail,
  Area,
  User,
} from 'src/submodules/database/entities';
import { Repository } from 'typeorm';
import { ActivityLogService } from '../activity-log/activity-log.service';
import { LocationService } from '../location/location.service';
import { CreateAreaDto, ListAreaDto, UpdateAreaDto } from './dto/area.dto';

@Injectable()
export class AreaService {
  constructor(
    @InjectRepository(Area)
    private areaRepo: Repository<Area>,

    private readonly locationService: LocationService,

    private readonly activityLogService: ActivityLogService,
  ) {}

  async getAll(query: ListAreaDto) {
    const entity = {
      entityRepo: this.areaRepo,
      alias: 'area',
    };

    const filterBuilder = new FilterBuilder(entity, query)
      .addLeftJoinAndSelect(['id', 'fullName', 'email'], 'creator')
      .addLeftJoinAndSelect(['id', 'name', 'type'], 'province')
      .addLeftJoinAndSelect(['id', 'name', 'type'], 'districts')
      .addWhereInNumber('provinceId', 'provinceIds')
      .addUnAccentString('name')
      .addNumber('provinceId')
      .addNumber('status')
      .addNumber('id')
      .addDate('updatedAt', 'updatedDateFrom', 'updatedDateTo')
      .addPagination()
      .sortBy('id');

    const [list, total] = await filterBuilder.getManyAndCount();
    return listResponse(list, total, query);
  }

  async create(
    { name, provinceId, districtIds }: CreateAreaDto,
    creator: User,
  ) {
    const [province, districts] = await Promise.all([
      this.locationService.getProvince(provinceId),
      this.locationService.getDistrictByIds(districtIds, provinceId),
    ]);

    const area = this.areaRepo.create({
      name,
      provinceId: province.id,
      creatorId: creator.id,
    });

    const newArea = await this.areaRepo.save(area);

    districts.map(async (district) => {
      district.areaId = newArea.id;
    });

    await this.locationService.saveLocations(districts);

    return newArea;
  }

  async getOne(id: number) {
    const area = await this.areaRepo
      .createQueryBuilder('area')
      .select([
        'area',
        'creator.id',
        'creator.fullName',
        'creator.email',
        'districts.id',
        'districts.name',
        'districts.type',
      ])
      .leftJoin('area.creator', 'creator')
      .leftJoin('area.districts', 'districts')
      .where('area.id = :id', { id })
      .getOne();

    if (!area) {
      throw ErrorHttpException(HttpStatus.NOT_FOUND, 'AREA_NOT_FOUND');
    }

    const districtIds = area.districts.map((item) => item.id);

    delete area.districts;

    return { ...area, districtIds };
  }

  async update(id: number, body: UpdateAreaDto, updater: User) {
    const area = await this.areaRepo.findOneBy({ id });
    const { name, status, provinceId, districtIds } = body;

    const activityDetails =
      await this.activityLogService.createActivityLogDetail(
        'API_AREA_UPDATE',
        area,
        body,
        updater.id,
        ActivityLogDetail.MODULE.AREA,
      );

    if (name) area.name = name;
    if (status) area.status = status;
    if (provinceId) {
      await this.locationService.getProvince(provinceId);
      area.provinceId = provinceId;
    }
    if (districtIds) {
      const results = await Promise.all([
        this.locationService.getProvinceByAreaId(id),
        this.locationService.getDistrictByIds(districtIds, area.provinceId),
      ]);

      const previousDistrictIds = results[0].map((province) => province.id);
      await this.locationService.updateListLocation(null, previousDistrictIds);
      await this.locationService.updateListLocation(id, districtIds);
    }

    await this.activityLogService.saveActivityLogDetail(activityDetails);
    return await this.areaRepo.save(area);
  }
}
