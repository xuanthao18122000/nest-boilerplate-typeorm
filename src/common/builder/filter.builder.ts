import {
  ObjectLiteral,
  Repository,
  SelectQueryBuilder
} from 'typeorm';
import { SORT_ENUM } from '../enums';
import { PaginationOptions } from './custom-base.filter';

export default class FilterBuilder<T, TQuery extends PaginationOptions> {
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
      this.queryBuilder = entity.entityRepo.createQueryBuilder(entity.alias);
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

  addSelect(selectFields: string[], entityName: string = this.entityName): this {
    if (selectFields.length !== 0) {
      this.queryBuilder = this.queryBuilder.select(
        selectFields.map((field) => `${entityName}.${field}`),
      );
    }

    return this;
  }

  addLeftJoinAndSelect(
    selectFields: string[] = [],
    entityNameRelation: string,
    entityNameMain: string = this.entityName
  ) {
    this.queryBuilder.leftJoin(
      `${entityNameMain}.${entityNameRelation}`,
      entityNameRelation
    );
  
    if (selectFields.length > 0) {
      this.queryBuilder.addSelect(
        selectFields.map((field) => `${entityNameRelation}.${field}`)
      );
    }
  
    return this;
  }
  

  select(selectFields: string[]): this {
    if (selectFields.length !== 0) {
      this.queryBuilder = this.queryBuilder.select(
        selectFields.map((field) => `${this.entityName}.${field}`),
      );
    }

    return this;
  }

  addNumber(name: keyof TQuery, valueNumber?: number, entityNameRelation: string = this.entityName): this {
    const value = valueNumber || this.query[name];
    const columnToQuery = `${entityNameRelation}.${name.toString()}`;
    if (value) {
      this.queryBuilder.andWhere(`${columnToQuery} = :name`, { name: value });
    }
    return this;
  }

  addWhereIn(name: keyof TQuery, array: Array<number> = [], entityNameRelation: string = this.entityName): this {
    const columnToQuery = `${entityNameRelation}.${name.toString()}`;
    if (name) {
      this.queryBuilder.andWhere(`${columnToQuery} IN (:...values)`, {
        values: array,
      });
    }
    return this;
  }

  addString(name: keyof TQuery, valueString?: string, entityNameRelation: string = this.entityName): this {
    const propertyName = String(name);
    const value = valueString || this.query[name];

    if (value) {
      const columnToQuery = `${entityNameRelation}.${propertyName}`;
      this.queryBuilder.andWhere(
        `unaccent(LOWER(${columnToQuery})) ILIKE (LOWER(:${propertyName}))`,
        {
          [name]: `%${value}%`,
        }
      );
    }
    return this;
  }

  addUnAccentString(
    name: keyof TQuery,
    valueString?: string,
    entityNameRelation: string = this.entityName,
  ): this {
    const propertyName = String(name);
    const value = valueString || this.query[name];

    if (value) {
      const columnToQuery = `${entityNameRelation}.${propertyName}`;
      this.queryBuilder.andWhere(
        `unaccent(LOWER(${columnToQuery})) ILIKE unaccent(LOWER(:${propertyName}))`,
        {
          [name]: `%${value}%`,
        }
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
    entityNameRelation: string = this.entityName,
  ): this {
    const columnToQuery = `${entityNameRelation}.${dateName}`;
    const startDate = startDateValue || this.query[startDateName];
    const endDate = endDateValue || this.query[endDateName];

    if (startDate) {
      this.queryBuilder.andWhere(
        `${columnToQuery} >= :startDate`,
        {
          startDate,
        },
      );
    }
    if (endDate) {
      this.queryBuilder.andWhere(`${columnToQuery} <= :endDate`, {
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
