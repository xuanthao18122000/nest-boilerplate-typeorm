import { Injectable } from '@nestjs/common';
import { ILike, IsNull, Not, SelectQueryBuilder } from 'typeorm';
import { BaseFilter } from '../share/custom-base.filter';

@Injectable()
export default class FilterBuilderService {
  public buildQuery<T>(
    Class: { new (...arg: any[]): T },
    entityName: string,
    queryBuilder: SelectQueryBuilder<T>,
    query: BaseFilter = {
      filter: {
        selectFields: [],
        numberFields: [],
        stringFields: [],
        unaccentFields: [],
        dateFields: {
          dateName: null,
          startDateField: null,
          endDateField: null,
        },
        sortName: null,
      },
      page: 0,
      perPage: 10000,
      sort: 'DESC',
    },
  ): SelectQueryBuilder<T> {
    const instance = new Class({});
    const { filter, perPage, sort } = query;
    let { page } = query;
    const {
      dateFields,
      numberFields,
      selectFields,
      stringFields,
      unaccentFields,
      sortName,
    } = filter;

    // Loại bỏ các thuộc tính không có trong instance
    Object.entries(filter).map(([property, value]) => {
      if (instance.hasOwnProperty(property)) {
        queryBuilder.andWhere({
          [property]: value,
        });
      }
    });

    if (selectFields.length > 0) {
      queryBuilder = queryBuilder.select(
        selectFields.map((field) => `${entityName}.${field}`),
      );
    }

    for (const field of numberFields) {
      if (field) {
        queryBuilder.andWhere({
          [field]: field ? field : Not(IsNull()),
        });
      }
    }

    for (const field of stringFields) {
      if (query[field]) {
        queryBuilder.andWhere({
          [field]: field ? ILike(`%${query[field]}%`) : Not(IsNull()),
        });
      }
    }

    for (const field of unaccentFields) {
      if (query[field]) {
        queryBuilder.andWhere(
          `unaccent(LOWER(${entityName}.${field})) ILIKE unaccent(LOWER(:${field}))`,
          {
            [field]: `%${query[field]}%`,
          },
        );
      }
    }

    if (
      dateFields &&
      dateFields.dateName &&
      (query[dateFields.startDateField] || query[dateFields.endDateField])
    ) {
      queryBuilder.andWhere(`${dateFields.startDateField} >= :startDate`, {
        startDate: query[dateFields.startDateField],
      });
      queryBuilder.andWhere(`${dateFields.endDateField} <= :endDate`, {
        endDate: query[dateFields.endDateField],
      });
    }

    if (typeof page === 'number') {
      if (page && perPage) page = (page - 1) * perPage;
      queryBuilder.skip(page);

      if (perPage) queryBuilder.take(perPage);
    }

    if (sort === 'ASC' || sort === 'DESC') {
      queryBuilder.orderBy(`${sortName}`, sort);
    }

    return queryBuilder;
  }
}
