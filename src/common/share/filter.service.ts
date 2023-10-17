import {
  ILike,
  In,
  IsNull,
  Not,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';
import { SORT_ENUM } from '../enums';
import { BaseFilter } from './custom-base.filter';

export default class FilterBuilder<T, TQuery extends BaseFilter> {
  private entityName: string;
  public queryBuilder: SelectQueryBuilder<T>;
  private query: TQuery;
  private entityRepo: Repository<T>;

  constructor(entityRepo: Repository<T>, query: TQuery) {
    this.query = query;
    this.entityRepo = entityRepo;
  }

  createQueryBuilder(entityName: string) {
    this.entityName = entityName;
    this.queryBuilder = this.entityRepo.createQueryBuilder(entityName);
    return this;
  }

  leftJoinAndSelect(entityNameRelation: string) {
    this.queryBuilder.leftJoinAndSelect(
      `${this.entityName}.${entityNameRelation}`,
      `${entityNameRelation}`,
    );
    return this;
  }

  select(selectFields: string[]) {
    const { perPage = 10, getFull = false } = this.query;
    let { page = 1 } = this.query;

    if (selectFields.length !== 0) {
      this.queryBuilder = this.queryBuilder.select(
        selectFields.map((field) => `${this.entityName}.${field}`),
      );
    }

    if (!getFull) {
      if (page && perPage) page = (page - 1) * perPage;
      this.queryBuilder.skip(page);

      if (perPage) this.queryBuilder.take(perPage);
    }
    return this;
  }

  andSelect(selectFields: string[]) {
    const { perPage = 10, getFull = false } = this.query;
    let { page = 1 } = this.query;
    this.queryBuilder = this.queryBuilder.select(
      selectFields.map((field) => `${field}`),
    );

    if (!getFull) {
      if (page && perPage) page = (page - 1) * perPage;
      this.queryBuilder.skip(page);

      if (perPage) this.queryBuilder.take(perPage);
    }
  }

  addLikeString(name: string, value: string) {
    if (!value) value = this.query[name];
    this.queryBuilder.andWhere({
      [name]: name ? ILike(`%${value}%`) : Not(IsNull()),
    });
    return this.queryBuilder;
  }

  addNumber(name: string, value: number = undefined) {
    if (!value) value = this.query[name];
    if (value) {
      this.queryBuilder.andWhere({
        [name]: value,
      });
    }
    return this;
  }

  addEnum(name: string, array: Array<number> = []) {
    if (name) {
      this.queryBuilder.andWhere({ [name]: In(array) });
    }
    return this;
  }

  addString(name: string, value: string = undefined) {
    if (!value) value = this.query[name];
    if (value) {
      this.queryBuilder.andWhere({
        [name]: ILike(`%${value}%`),
      });
    }
    return this;
  }

  addUnAccentString(name: string, value: string = undefined) {
    if (!value) value = this.query[name];
    if (value) {
      this.queryBuilder.andWhere(
        `unaccent(LOWER(${this.entityName}.${name})) ILIKE unaccent(LOWER(:${name}))`,
        {
          [name]: `%${value}%`,
        },
      );
    }
    return this;
  }

  addDate(
    dateName: string,
    startDateName: string,
    endDateName: string,
    startDateValue: Date = undefined,
    endDateValue: Date = undefined,
  ) {
    if (!startDateValue) startDateValue = this.query[startDateName];
    if (!endDateValue) endDateValue = this.query[endDateName];

    if (startDateValue) {
      this.queryBuilder.andWhere(
        `${this.entityName}.${dateName} >= :startDateValue`,
        {
          startDateValue,
        },
      );
    }
    if (endDateValue) {
      this.queryBuilder.andWhere(
        `${this.entityName}.${dateName} <= :endDateValue`,
        {
          endDateValue,
        },
      );
    }

    return this;
  }

  sortBy(column: string, sort: SORT_ENUM = SORT_ENUM.DESC) {
    if (this.query.sort) sort = this.query.sort;
    this.queryBuilder.orderBy(`${this.entityName}.${column}`, sort);
    return this;
  }
}
