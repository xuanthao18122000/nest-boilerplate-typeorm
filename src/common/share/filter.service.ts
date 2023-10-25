import {
  ILike,
  In,
  ObjectLiteral,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';
import { SORT_ENUM } from '../enums';
import { BaseFilter } from './custom-base.filter';

export default class FilterBuilder<T, TQuery extends BaseFilter> {
  private entityName: string;
  public queryBuilder: SelectQueryBuilder<T>;
  private query: TQuery;

  constructor(
    entity: { entityRepo: Repository<T>; alias: string },
    query: TQuery,
  ) {
    if (entity) {
      this.query = query;
      this.entityName = entity.alias;
      this.queryBuilder = entity.entityRepo
        .createQueryBuilder(entity.alias)
        .orderBy({ id: 'DESC' });
    }
  }

  addLeftJoin(
    property: string,
    alias: string,
    condition?: string,
    parameters?: ObjectLiteral,
  ) {
    this.queryBuilder.leftJoin(property, alias, condition, parameters);
  }

  addInnerJoin(
    property: string,
    alias: string,
    condition?: string,
    parameters?: ObjectLiteral,
  ) {
    this.queryBuilder.innerJoin(property, alias, condition, parameters);
  }

  addLeftJoinAndSelect(entityNameRelation: string) {
    this.queryBuilder.leftJoinAndSelect(
      `${this.entityName}.${entityNameRelation}`,
      `${entityNameRelation}`,
    );
    return this;
  }

  addSelect(selectFields: string[]): this {
    if (selectFields.length !== 0) {
      this.queryBuilder = this.queryBuilder.select(
        selectFields.map((field) => `${this.entityName}.${field}`),
      );
    }

    return this;
  }

  addSelectArray(selectFields: string[]): this {
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
    return this;
  }

  addNumber(name: keyof TQuery, valueNumber?: number): this {
    const value = valueNumber || this.query[name];
    if (value) {
      this.queryBuilder.andWhere({
        [name]: value,
      });
    }
    return this;
  }

  addWhereIn(name: keyof TQuery, array: Array<number> = []): this {
    if (name) {
      this.queryBuilder.andWhere({ [name]: In(array) });
    }
    return this;
  }

  addString(name: keyof TQuery, valueString?: string): this {
    const value = valueString || this.query[name];

    if (value) {
      this.queryBuilder.andWhere({
        [name]: ILike(`%${value}%`),
      });
    }
    return this;
  }

  addUnAccentString(name: keyof TQuery, valueString?: string): this {
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
    startDateValue?: Date,
    endDateValue?: Date,
  ): this {
    // const propertyName = String(name);
    const startDate = startDateValue || this.query[startDateName];
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

  addPagination(page?: number, perPage?: number, getFull?: boolean): this {
    const limit = perPage || this.query.perPage || 10;
    const offset = (page - 1 || this.query.page - 1 || 0) * limit;
    const isdPagination = getFull || this.query.getFull || false;

    if (!isdPagination) {
      this.queryBuilder.skip(offset).take(limit);
    }
    return this;
  }

  sortBy(column: string, sort: SORT_ENUM = SORT_ENUM.DESC): this {
    if (this.query.sort) sort = this.query.sort;
    this.queryBuilder.addOrderBy(`${this.entityName}.${column}`, sort);
    return this;
  }
}
