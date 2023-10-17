import { ILike, In, Repository, SelectQueryBuilder } from 'typeorm';
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

  addNumber(name: keyof TQuery, valueNumber: number = undefined) {
    const value = valueNumber || this.query[name];
    if (value) {
      this.queryBuilder.andWhere({
        [name]: value,
      });
    }
    return this;
  }

  addEnum(name: keyof TQuery, array: Array<number> = []) {
    if (name) {
      this.queryBuilder.andWhere({ [name]: In(array) });
    }
    return this;
  }

  addString(name: keyof TQuery, valueString: string = undefined) {
    const value = valueString || this.query[name];

    if (value) {
      this.queryBuilder.andWhere({
        [name]: ILike(`%${value}%`),
      });
    }
    return this;
  }

  addUnAccentString(name: keyof TQuery, valueString: string = undefined) {
    const propertyName = String(name);
    const value = valueString || this.query[name];

    if (value) {
      this.queryBuilder.andWhere(
        `unaccent(LOWER(${this.entityName}.${propertyName})) ILIKE unaccent(LOWER(:${propertyName}))`,
        {
          [name]: `%${value}%`,
        },
      );
    }
    return this;
  }

  addDate(
    dateName: string,
    startDateName: keyof TQuery,
    endDateName: keyof TQuery,
    startDateValue: Date = undefined,
    endDateValue: Date = undefined,
  ) {
    // const propertyName = String(name);
    const startDate =
      startDateValue || this.query[startDateName];
    const endDate = endDateValue || this.query[endDateName];

    if (startDate) {
      this.queryBuilder.andWhere(
        `${this.entityName}.${dateName} >= :startDate`,
        {
          startDate,
        },
      );
    }
    if (endDate) {
      this.queryBuilder.andWhere(`${this.entityName}.${dateName} <= :endDate`, {
        endDate,
      });
    }

    return this;
  }

  sortBy(column: string, sort: SORT_ENUM = SORT_ENUM.DESC) {
    if (this.query.sort) sort = this.query.sort;
    this.queryBuilder.orderBy(`${this.entityName}.${column}`, sort);
    return this;
  }
}
