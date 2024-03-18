import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import FilterBuilder from 'src/submodules/common/builder/filter.builder';
import UpdateBuilder from 'src/submodules/common/builder/update.builder';
import { ErrorHttpException } from 'src/submodules/common/exceptions/throw.exception';
import { listResponse } from 'src/submodules/common/response/response-list.response';
import { Brand, User } from 'src/submodules/database/entities';
import { Repository } from 'typeorm';
import { CreateBrandDto, ListBrandDto, UpdateBrandDto } from './dto/brand.dto';

@Injectable()
export class BrandService {
  constructor(
    @InjectRepository(Brand)
    private brandRepo: Repository<Brand>,
  ) {}

  private buildEntity(alias: string = 'product') {
    return {
      entityRepo: this.brandRepo,
      alias: alias,
    };
  }

  async create(body: CreateBrandDto, creator: User) {
    const brand = this.brandRepo.create({
      ...body,
      creatorId: creator.id,
    });

    return await this.brandRepo.save(brand);
  }

  async getAll(query: ListBrandDto) {
    const entity = this.buildEntity();

    const brands = new FilterBuilder(entity, query)
      .addLeftJoinAndSelect(['id', 'fullName'], 'creator')
      .addUnAccentString('name')
      .addNumber('id')
      .addNumber('status')
      .addNumber('category')
      .addNumber('creatorId')
      .addDate('createdAt', 'createdDateFrom', 'createdDateTo')
      .addPagination()
      .sortBy('id');

    const [list, total] = await brands.getManyAndCount();
    return listResponse(list, total, query);
  }

  async getOne(id: number) {
    return await this.findBrandByPk(id);
  }

  async update(id: number, body: UpdateBrandDto) {
    const brand = await this.findBrandByPk(id);

    const dataUpdate = new UpdateBuilder(brand, body)
      .updateColumns(['name', 'status', 'category'])
      .getNewData();

    return await this.brandRepo.save(dataUpdate);
  }

  async findBrandByPk(id: number) {
    const entity = this.buildEntity();

    const brand = new FilterBuilder(entity)
      .addLeftJoinAndSelect(['id', 'fullName'], 'creator')
      .addNumber('id', id)
      .getOne();

    if (!brand) {
      throw ErrorHttpException(HttpStatus.NOT_FOUND, 'BRAND_NOT_FOUND');
    }

    return brand;
  }
}
