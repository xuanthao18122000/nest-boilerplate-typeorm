import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as _ from 'lodash';
import FilterBuilder from 'src/submodule/common/builder/filter.builder';
import { ErrorHttpException } from 'src/submodule/common/exceptions/throw.exception';
import { listResponse } from 'src/submodule/common/response/response-list.response';
import {
  Area,
  ProductTransaction,
  Staff,
  User,
} from 'src/submodule/database/entities';
import { Repository } from 'typeorm';
import { LocationService } from '../location/location.service';
import {
  CreateAreaDistrictDto,
  CreateAreaDto,
  ListAreaDto,
  StatisticsAreaDto,
  UpdateAreaDto,
} from './dto/area.dto';

@Injectable()
export class AreaService {
  constructor(
    @InjectRepository(Area)
    private areaRepo: Repository<Area>,

    @InjectRepository(ProductTransaction)
    private productTransactionRepo: Repository<ProductTransaction>,

    @InjectRepository(Staff)
    private staffRepo: Repository<Staff>,

    private readonly locationService: LocationService,
  ) {}

  private buildEntity(alias: string = 'area') {
    return {
      entityRepo: this.areaRepo,
      alias,
    };
  }

  async getAll(query: ListAreaDto) {
    const entity = this.buildEntity();

    const filterBuilder = new FilterBuilder(entity, query)
      .addLeftJoinAndSelect(['id', 'fullName', 'email'], 'creator')
      .addLeftJoinAndSelect(['id', 'name', 'type'], 'province')
      .addLeftJoinAndSelect(['id', 'name', 'type'], 'districts')
      .addLeftJoinAndSelect(['id', 'name'], 'rou')
      .addWhereInNumber('provinceId', 'provinceIds')
      .addUnAccentString('name')
      .addNumber('provinceId')
      .addNumber('status')
      .addNumber('id')
      .addDate('updatedAt', 'updatedDateFrom', 'updatedDateTo');

    const [list, total] = await filterBuilder.addPagination().getManyAndCount();
    return listResponse(list, total, query);
  }

  async create(
    { name, provinceId, districtIds }: CreateAreaDto,
    creator: User,
  ) {
    const [province, districts, areaDistrictRemove] = await Promise.all([
      this.locationService.getProvince(provinceId),
      this.locationService.getDistrictByIds(districtIds, provinceId),
      this.locationService.getAreaDistrictRemove(districtIds, provinceId), // List AreaIds Delete
    ]);

    const area = this.areaRepo.create({
      name,
      type: Area.TYPE.AREA,
      rouId: province.rouId,
      provinceId: province.id,
      creatorId: creator.id,
    });

    const newArea = await this.areaRepo.save(area);
    districts.map(async (district) => {
      district.areaId = newArea.id;
    });

    await this.locationService.saveLocations(districts);

    const districtsArea = await this.locationService.getDistrictsNotInAreas(
      provinceId,
    );

    // Tạo quận huyện không có Area thành Area: Type = AREA_DISTRICT
    for (const district of districtsArea) {
      const area = this.areaRepo.create({
        provinceId,
        name: district.name,
        type: Area.TYPE.AREA_DISTRICT,
        creatorId: creator.id,
      });

      const newArea = await this.areaRepo.save(area);
      district.areaId = newArea.id;
    }

    if (districtsArea.length !== 0) {
      await this.locationService.saveLocations(districtsArea);
    }
    if (areaDistrictRemove.length !== 0) {
      await this.areaRepo.remove(areaDistrictRemove);
    }

    return newArea;
  }

  async createAreaDistrict(
    { provinceIds }: CreateAreaDistrictDto,
    creator: User,
  ) {
    for (const provinceId of provinceIds) {
      const districtsArea = await this.locationService.getDistrictsNotInAreas(
        provinceId,
      );

      // Tạo quận huyện không có Area thành Area: Type = AREA_DISTRICT
      for (const district of districtsArea) {
        const area = this.areaRepo.create({
          provinceId,
          name: district.name,
          type: Area.TYPE.AREA_DISTRICT,
          creatorId: creator.id,
        });

        const newArea = await this.areaRepo.save(area);
        district.areaId = newArea.id;
      }

      if (districtsArea.length !== 0) {
        await this.locationService.saveLocations(districtsArea);
      }
    }

    return true;
  }

  async getAreasByIds(areaIds: number[]): Promise<Area[]> {
    if (areaIds.length !== 0) {
      const existingAreas = await this.areaRepo
        .createQueryBuilder('area')
        .andWhere('area.id IN (:...areaIds)', { areaIds })
        .getMany();

      return existingAreas;
    }

    return [];
  }

  async checkAreaExistence(id: number): Promise<void> {
    const area = await this.areaRepo
      .createQueryBuilder('area')
      .where('area.id = :id', { id })
      .getOne();

    if (!area) {
      throw ErrorHttpException(HttpStatus.NOT_FOUND, 'AREA_NOT_FOUND');
    }
  }

  async getAreasGeoMapByProvinceId(provinceId: number) {
    const entity = this.buildEntity();

    const filterBuilder = new FilterBuilder(entity, { getFull: true })
      .addLeftJoinAndSelect([], 'districts')
      .addLeftJoinAndSelect([], 'districtORPs', 'districts')
      .addLeftJoinAndSelect([], 'productManagements', 'districtORPs')
      .addLeftJoinAndSelect([], 'product', 'productManagements')
      .addLeftJoinAndSelect([], 'productTransactions', 'productManagements')
      .addNumber('provinceId', provinceId)
      .sortBy('id');

    const [list, total] = await filterBuilder.getManyAndCount();
    return { list, total };
  }

  async getAreasGeoMapByAreaIds(areaIds: number[]) {
    const entity = this.buildEntity();

    const filterBuilder = new FilterBuilder(entity, { getFull: true })
      .addLeftJoinAndSelect([], 'districts')
      .addLeftJoinAndSelect([], 'districtORPs', 'districts')
      .addLeftJoinAndSelect([], 'productManagements', 'districtORPs')
      .addLeftJoinAndSelect([], 'product', 'productManagements')
      .addLeftJoinAndSelect([], 'productTransactions', 'productManagements')
      .addWhereInNumber('id', undefined, areaIds)
      .sortBy('id');

    const [list, total] = await filterBuilder.getManyAndCount();
    return { list, total };
  }

  async checkAreaIdsExistence(areaIds: number[]): Promise<void> {
    if (areaIds.length !== 0) {
      const existingAreas = await this.areaRepo
        .createQueryBuilder('area')
        .where('area.id IN (:...areaIds)', { areaIds })
        .getMany();

      if (existingAreas.length !== areaIds.length) {
        throw ErrorHttpException(HttpStatus.NOT_FOUND, 'AREA_NOT_FOUND');
      }
    }
  }

  getAreasActive(): Promise<Area[]> {
    return this.areaRepo
      .createQueryBuilder('area')
      .where('area.status = :status', { status: Area.STATUS.ACTIVE })
      .getMany();
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
      .andWhere('area.type = :type', { type: Area.TYPE.AREA })
      .getOne();

    if (!area) {
      throw ErrorHttpException(HttpStatus.NOT_FOUND, 'AREA_NOT_FOUND');
    }

    const districtIds = area.districts.map((item) => item.id);
    delete area.districts;

    return { ...area, districtIds };
  }

  async getAreaByName(name: string) {
    const entity = this.buildEntity();

    const filterBuilder = new FilterBuilder(entity)
      .addUnAccentString('name', name)
      .addPagination()
      .sortBy('id');

    const rou = await filterBuilder.getOne();

    if (!rou) {
      throw ErrorHttpException(HttpStatus.NOT_FOUND, 'ROU_NOT_FOUND');
    }

    return rou;
  }

  async update(id: number, body: UpdateAreaDto) {
    const area = await this.areaRepo.findOneBy({ id });
    const { name, status } = body;

    if (name) area.name = name;
    if (status) area.status = status;

    return await this.areaRepo.save(area);
  }

  async getStatistics({ areaId, provinceId }: StatisticsAreaDto) {
    const queryBuilder = this.areaRepo
      .createQueryBuilder('area')
      .where('area.provinceId = :provinceId', { provinceId });

    if (areaId) {
      queryBuilder.andWhere('area.id = :areaId', {
        areaId,
      });
    }

    const areas = await queryBuilder.getMany();

    const statistics = [];

    for (const area of areas) {
      const [countAse, countVolume] = await Promise.all([
        this.countASEInAreas(area.id),
        this.countVolumeORPInAreas(area.id),
      ]);

      statistics.push({
        ...area,
        countAse,
        countVolume,
      });
    }

    return statistics;
  }

  countASEInAreas(areaId: number) {
    return this.staffRepo
      .createQueryBuilder('staff')
      .andWhere(`:areaId = ANY(staff.areaIds)`, {
        areaId,
      })
      .getCount();
  }

  async countVolumeORPInAreas(areaId: number) {
    const entity = {
      entityRepo: this.productTransactionRepo,
      alias: 'productTransaction',
    };

    const filterBuilder = new FilterBuilder(entity, { getFull: true })
      .addLeftJoin('productManagement')
      .addLeftJoin('orp', 'productManagement')
      .addNumber('areaId', areaId, 'orp');

    const productTransactions = await filterBuilder.getMany();

    return _.sumBy(productTransactions, (pt: ProductTransaction) =>
      Number(pt.volume),
    );
  }

  getAreasByProvinceId(provinceId: number, endDate?: Date) {
    const queryBuilder = this.areaRepo
      .createQueryBuilder('area')
      .where('area.provinceId = :provinceId', { provinceId });

    if (endDate) {
      queryBuilder.andWhere(`area.createdAt <= :endDate`, {
        endDate,
      });
    }

    return queryBuilder.getMany();
  }
}
