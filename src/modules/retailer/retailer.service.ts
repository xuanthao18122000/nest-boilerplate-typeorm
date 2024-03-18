import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import FilterBuilder from 'src/submodules/common/builder/filter.builder';
import UpdateBuilder from 'src/submodules/common/builder/update.builder';
import { ErrorHttpException } from 'src/submodules/common/exceptions/throw.exception';
import { listResponse } from 'src/submodules/common/response/response-list.response';
import { ORP, User } from 'src/submodules/database/entities';
import { Repository } from 'typeorm';
import {
  CreateRetailerDto,
  ListRetailerDto,
  UpdateRetailerDto,
} from './dto/retailer.dto';

@Injectable()
export class RetailerService {
  constructor(
    @InjectRepository(ORP)
    private orpRepo: Repository<ORP>,
  ) {}

  async create(body: CreateRetailerDto, creator: User) {
    await this.checkNameNoneExistence(body.name);

    const newRetailer = this.orpRepo.create({
      ...body,
      type: ORP.TYPE.RETAILER,
      creatorId: creator.id,
    });

    return await this.orpRepo.save(newRetailer);
  }

  async getAll(query: ListRetailerDto) {
    const entity = {
      entityRepo: this.orpRepo,
      alias: 'retailer',
    };

    const retailers = new FilterBuilder(entity, query)
      .addLeftJoinAndSelect(['id', 'fullName', 'phoneNumber'], 'creator')
      .addLeftJoinAndSelect(['id', 'fullName', 'phoneNumber'], 'manager')
      .addLeftJoinAndSelect(['id', 'name'], 'rou')
      .addNumber('type', ORP.TYPE.RETAILER)
      .addUnAccentString('contactKey')
      .addUnAccentString('longName')
      .addUnAccentString('name')
      .addString('phoneNumber')
      .addNumber('provinceId')
      .addNumber('areaId')
      .addNumber('status')
      .addNumber('size')
      .addNumber('rouId')
      .addNumber('odId')
      .addNumber('id')
      .addDate('createdAt', 'createdDateFrom', 'createdDateTo')
      .addPagination()
      .sortBy('id');

    retailers.queryBuilder
      .leftJoinAndMapOne('retailer.od', ORP, 'od', 'od.id = retailer.odId')
      .select([
        'retailer',
        'creator.id',
        'creator.fullName',
        'creator.phoneNumber',
        'manager.id',
        'manager.fullName',
        'manager.phoneNumber',
        'rou.id',
        'rou.name',
        'od.id',
        'od.name',
      ]);

    const [list, total] = await retailers.getManyAndCount();
    return listResponse(list, total, query);
  }

  async update(id: number, body: UpdateRetailerDto) {
    const retailer = await this.findRetailerByPk(id);

    const dataUpdate = new UpdateBuilder(retailer, body)
      .updateColumns([
        'name',
        'longName',
        'image',
        'images',
        'lat',
        'lng',
        'status',
        'provinceId',
        'areaId',
        'districtId',
        'wardId',
        'address',
        'contactKey',
        'phoneNumber',
        'presenter',
        'size',
        'odId',
        'rouId',
        'managerId',
        'contactInformation',
      ])
      .getNewData();

    return await this.orpRepo.save(dataUpdate);
  }

  async findRetailerByPk(id: number) {
    const retailer = await this.orpRepo.findOneBy({
      id,
      type: ORP.TYPE.RETAILER,
    });

    if (!retailer) {
      throw ErrorHttpException(HttpStatus.NOT_FOUND, 'RETAILER_NOT_FOUND');
    }

    return retailer;
  }

  private async checkNameNoneExistence(name: string): Promise<void> {
    const isExistName = await this.orpRepo.findOneBy({
      name,
      type: ORP.TYPE.RETAILER,
    });

    if (isExistName) {
      throw ErrorHttpException(HttpStatus.CONFLICT, 'RETAILER_EXISTED');
    }
  }
}
