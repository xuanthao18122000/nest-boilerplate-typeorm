import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import FilterBuilder from 'src/submodules/common/builder/filter.builder';
import { ErrorHttpException } from 'src/submodules/common/exceptions/throw.exception';
import { listResponse } from 'src/submodules/common/response/response-list.response';
import { Location } from 'src/submodules/database/entities';
import { Repository } from 'typeorm';
import { GetLocationDto } from './dto/location.dto';

@Injectable()
export class LocationService {
  constructor(
    @InjectRepository(Location)
    private locationRepo: Repository<Location>,
  ) {}

  async getAll(query: GetLocationDto) {
    const entity = {
      entityRepo: this.locationRepo,
      alias: 'location',
    };

    const locations = new FilterBuilder(entity, query)
      .addWhereInNumber('areaId', 'areaIds')
      .addUnAccentString('name')
      .addNumber('parentId')
      .addNumber('areaId')
      .addNumber('rouId')
      .addNumber('type')
      .sortBy('id');

    const [list, total] = await locations.getManyAndCount();
    return listResponse(list, total, { getFull: true });
  }

  async getProvince(id: number): Promise<Location> {
    const province = await this.locationRepo.findOneBy({
      id,
      type: Location.TYPE.PROVINCE,
    });

    if (!province) {
      throw ErrorHttpException(HttpStatus.NOT_FOUND, 'PROVINCE_NOT_FOUND');
    }

    return province;
  }

  async getProvinces(): Promise<Location[]> {
    return await this.locationRepo
      .createQueryBuilder('location')
      .where('location.type = :type', { type: Location.TYPE.PROVINCE })
      .getMany();
  }

  async getProvinceByNames(names: string[]): Promise<Location[]> {
    return await this.locationRepo
      .createQueryBuilder('location')
      .where('location.type = :type', { type: Location.TYPE.PROVINCE })
      .andWhere('location.name IN (:...names)', { names: names })
      .getMany();
  }

  async getProvinceByAreaId(areaId: number): Promise<Location[]> {
    const province = await this.locationRepo
      .createQueryBuilder('location')
      .where('location.areaId = :areaId', { areaId })
      .getMany();

    return province;
  }

  async getProvinceByRouId(rouId?: number): Promise<Location[]> {
    let provinces: Location[];

    if (rouId) {
      provinces = await this.locationRepo
        .createQueryBuilder('location')
        .where('location.type = :type', { type: Location.TYPE.PROVINCE })
        .andWhere('location.rouId = :rouId', { rouId })
        .getMany();
    } else {
      provinces = await this.locationRepo
        .createQueryBuilder('location')
        .where('location.type = :type', { type: Location.TYPE.PROVINCE })
        .andWhere('location.rouId IS NOT NULL')
        .getMany();
    }

    return provinces;
  }

  async getProvincesByIds(provinceIds: number[]): Promise<Location[]> {
    if (provinceIds.length !== 0) {
      const existingProvinces = await this.locationRepo
        .createQueryBuilder('province')
        .where('province.type = :type', { type: Location.TYPE.PROVINCE })
        .andWhere('province.id IN (:...provinceIds)', { provinceIds })
        .getMany();

      if (existingProvinces.length !== provinceIds.length) {
        throw ErrorHttpException(HttpStatus.NOT_FOUND, 'PROVINCE_NOT_FOUND');
      }

      return existingProvinces;
    }

    return [];
  }

  async getDistrictByIds(
    districtIds: number[],
    parentId: number,
  ): Promise<Location[]> {
    if (districtIds.length !== 0) {
      const existingDistricts = await this.locationRepo
        .createQueryBuilder('district')
        .where('district.parentId = :parentId', { parentId })
        .andWhere('district.id IN (:...districtIds)', { districtIds })
        .getMany();

      if (existingDistricts.length !== districtIds.length) {
        throw ErrorHttpException(HttpStatus.NOT_FOUND, 'DISTRICT_NOT_FOUND');
      }

      return existingDistricts;
    }

    return [];
  }

  async updateListLocation(areaId: number, areaIdsUpdate: number[]) {
    if (areaIdsUpdate.length !== 0) {
      await this.locationRepo
        .createQueryBuilder()
        .update(Location)
        .set({ areaId })
        .where(`id IN (:...areaIdsUpdate)`, { areaIdsUpdate })
        .execute();
    }
  }

  async saveLocations(locations: Location[]) {
    return this.locationRepo.save(locations);
  }
}
