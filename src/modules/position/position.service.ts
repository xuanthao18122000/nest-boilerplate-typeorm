import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import FilterBuilder from 'src/submodules/common/builder/filter.builder';
import UpdateBuilder from 'src/submodules/common/builder/update.builder';
import { ErrorHttpException } from 'src/submodules/common/exceptions/throw.exception';
import { listResponse } from 'src/submodules/common/response/response-list.response';
import { Position, User } from 'src/submodules/database/entities';
import { Repository } from 'typeorm';
import {
  CreatePositionDto,
  ListPositionDto,
  UpdatePositionDto,
} from './dto/position.dto';

@Injectable()
export class PositionService {
  constructor(
    @InjectRepository(Position)
    private positionRepo: Repository<Position>,
  ) {}

  async getAll(query: ListPositionDto) {
    const entity = {
      entityRepo: this.positionRepo,
      alias: 'position',
    };

    const filterBuilder = new FilterBuilder(entity, query)
      .addLeftJoinAndSelect(['id', 'fullName', 'email'], 'creator')
      .addNumber('status')
      .addNumber('id')
      .addPagination()
      .sortBy('id');

    const [list, total] = await filterBuilder.getManyAndCount();
    return listResponse(list, total, query);
  }

  async create(body: CreatePositionDto, creator: User) {
    const position = this.positionRepo.create({
      ...body,
      creatorId: creator.id,
    });

    const newPosition = await this.positionRepo.save(position);
    return newPosition.serialize();
  }

  async update(id: number, body: UpdatePositionDto) {
    const position = await this.findPositionByPk(id);

    const dataUpdate = new UpdateBuilder(position, body)
      .updateColumns(['name', 'status', 'type', 'description'])
      .getNewData();

    const positionUpdated = await this.positionRepo.save(dataUpdate);
    return positionUpdated.serialize();
  }

  async findPositionByPk(id: number): Promise<Position> {
    const position = await this.positionRepo.findOneBy({ id });

    if (!position) {
      throw ErrorHttpException(HttpStatus.NOT_FOUND, 'POSITION_NOT_FOUND');
    }

    return position;
  }
}
