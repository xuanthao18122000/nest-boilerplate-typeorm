import { ObjectLiteral, Repository, SelectQueryBuilder } from 'typeorm';
import { addOneDay } from '../../common/utils';
import { SORT_ENUM } from '../enums';
import { PaginationOptions } from './pagination-options.builder';

export default class FilterBuilder<
  T,
  TQuery extends Partial<PaginationOptions & T> = Partial<
    PaginationOptions & T
  >,
> {
  private entityName: string;
  public queryBuilder: SelectQueryBuilder<T>;
  private query: TQuery;
  private count = 0;
  constructor(
    entity: { entityRepo: Repository<T>; alias: string },
    query?: TQuery,
  ) {
    if (entity) {
      this.query = query;
      this.entityName = entity.alias;
      this.queryBuilder = entity.entityRepo.createQueryBuilder(entity.alias);
    }
  }

  private getParams() {
    this.count++;
    return '_' + this.count;
  }

  addLeftJoin(leftJoinTable: string, tableName: string = this.entityName) {
    this.queryBuilder.leftJoin(`${tableName}.${leftJoinTable}`, leftJoinTable);

    return this;
  }

  addInnerJoin(
    property: string,
    alias: string,
    condition?: string,
    parameters?: ObjectLiteral,
  ) {
    this.queryBuilder.innerJoin(property, alias, condition, parameters);
  }

  addSelect(selectFields: string[], tableName: string = this.entityName): this {
    if (selectFields.length !== 0) {
      this.queryBuilder = this.queryBuilder.select(
        selectFields.map((field) => `${tableName}.${field}`),
      );
    }

    return this;
  }

  /**
   * Thêm một LEFT JOIN và chọn các trường cụ thể từ bảng được kết nối.
   * @param {string[]} selectFields: Các trường muốn select trong table leftJoin - Required
   * @param {string} leftJoinTable: Tên bảng trong mối quan hệ left join - Required
   * @param {string} tableName: Tên của bảng chính - Optional , Optional, mặc định là tên bảng chính (this.entityName)
   * @returns {this} Một tham chiếu đến đối tượng gọi hàm để hỗ trợ chuỗi gọi phương thức
   */
  addLeftJoinAndSelect(
    selectFields: string[] = [],
    leftJoinTable: string,
    tableName: string = this.entityName,
  ): this {
    this.queryBuilder.leftJoin(`${tableName}.${leftJoinTable}`, leftJoinTable);

    if (selectFields.length > 0) {
      this.queryBuilder.addSelect(
        selectFields.map((field) => `${leftJoinTable}.${field}`),
      );
    } else {
      this.queryBuilder.addSelect(`${leftJoinTable}`);
    }

    return this;
  }

  leftJoinAndMapOne(
    selectFields: string[] = [],
    showColumn: string,
    leftJoinColumn: string,
    leftJoinTable: string,
    tableName: string = this.entityName,
  ): this {
    this.queryBuilder.leftJoinAndMapOne(
      `${tableName}.${showColumn}`,
      leftJoinTable,
      leftJoinTable,
      `${tableName}.id = ${tableName}.${leftJoinColumn}`,
    );

    if (selectFields.length > 0) {
      this.queryBuilder.addSelect(
        selectFields.map((field) => `${showColumn}.${field}`),
      );
    }

    return this;
  }

  /**
   * Select các trường từ bảng chính của truy vấn
   * @param {string[]} selectFields: Một mảng tên trường muốn select từ bảng chính - Required
   * @returns {this} Một tham chiếu đến đối tượng gọi hàm để hỗ trợ chuỗi gọi phương thức
   */
  select(selectFields: string[]): this {
    if (selectFields.length !== 0) {
      this.queryBuilder = this.queryBuilder.select(
        selectFields.map((field) => `${this.entityName}.${field}`),
      );
    }

    return this;
  }

  /**
   * Thêm điều kiện tìm kiếm số.
   * @param {keyof T | keyof TQuery} name: Tên trường cần tìm kiếm - Required.
   * @param {number} valueNumber: Giá trị số cần tìm kiếm. Nếu không được cung cấp, hàm sẽ sử dụng giá trị từ Query - Optional.
   * @param {string} tableName: Tên bảng tìm kiếm số- Optional, mặc định là tên bảng chính (this.entityName).
   * @returns {this} Một tham chiếu đến đối tượng gọi hàm để hỗ trợ chuỗi gọi phương thức.
   */
  addNumber<Entity = T>(
    name: keyof T | keyof TQuery | keyof Entity,
    valueNumber?: number,
    tableName: string = this.entityName,
  ): this {
    const params = this.getParams();
    const value = valueNumber || this.query[name as keyof T];
    const columnToQuery = `${tableName}.${name.toString()}`;
    if (value) {
      this.queryBuilder.andWhere(`${columnToQuery} = :${params}`, {
        [params]: value,
      });
    }

    return this;
  }

  andWhere(name: string, data: any) {
    this.queryBuilder.andWhere(`visitingHistory.${name} = :${name}`, {
      [name]: data,
    });

    return this;
  }

  andFullWhere(where: string, data: any) {
    this.queryBuilder.andWhere(`${where}`, data);

    return this;
  }

  /**
   * Thêm điều kiện tìm kiếm trong danh sách giá trị IN(array) vào truy vấn SQL.
   * @param {keyof T | keyof TQuery} name: Tên trường cần tìm kiếm - bắt buộc.
   * @param {Array<number>} array: Mảng các giá trị để tìm kiếm. (Tùy chọn)
   * @param {string} tableName: Tên bảng tìm kiếm - tùy chọn, mặc định là tên bảng chính (this.entityName).
   * @returns {this} Một tham chiếu đến đối tượng gọi hàm để hỗ trợ chuỗi gọi phương thức.
   */
  addWhereInNumber<K>(
    columnName: keyof T | keyof K,
    nameQuery: keyof TQuery,
    array?: Array<number>,
    tableName: string = this.entityName,
  ): this {
    const params = this.getParams();
    const arrayAddition = array || (this.query[nameQuery] as number[]);
    const columnToQuery = `${tableName}.${columnName.toString()}`;

    if (arrayAddition) {
      this.queryBuilder.andWhere(`${columnToQuery} IN (:...${params})`, {
        [params]: arrayAddition,
      });
    }
    return this;
  }

  addWhereInString(
    columnName: keyof T,
    nameQuery: keyof TQuery,
    array?: Array<string>,
    tableName: string = this.entityName,
  ): this {
    const params = this.getParams();
    const arrayAddition = array || (this.query[nameQuery] as string[]);
    const columnToQuery = `${tableName}.${columnName.toString()}`;

    if (arrayAddition) {
      this.queryBuilder.andWhere(`${columnToQuery} IN (:...${params})`, {
        [params]: arrayAddition,
      });
    }
    return this;
  }

  addWhereInArray<K>(
    columnName: keyof T | keyof K,
    nameQuery: keyof TQuery,
    number?: number,
    tableName: string = this.entityName,
  ): this {
    const params = this.getParams();
    const value = number || (this.query[nameQuery] as number);
    const columnToQuery = `${tableName}.${columnName.toString()}`;

    if (value) {
      this.queryBuilder.andWhere(`:${params} = ANY(${columnToQuery})`, {
        [params]: value,
      });
    }

    return this;
  }

  addWhereArrayInArrayOrEmptyCondition(
    columnName: keyof T,
    nameQuery: keyof TQuery,
    nameSelectAll?: string,
    arrayNumber?: number[],
    tableName: string = this.entityName,
  ): this {
    const params = this.getParams();
    const value = arrayNumber || (this.query[nameQuery] as number[]);
    const columnToQuery = `${tableName}.${columnName.toString()}`;
    const selectAll = `${tableName}.${nameSelectAll}`;

    if (value) {
      this.queryBuilder.andWhere(
        (qb) => {
          qb.where(
            `(SELECT COUNT(*) FROM UNNEST(${columnToQuery}) AS id WHERE id = ANY(:${params})) > 0`,
          ).orWhere(`${selectAll} = true`);
        },
        {
          [params]: value,
        },
      );
    }

    return this;
  }

  addWhereArrayInArray<K>(
    columnName: keyof T | keyof K,
    nameQuery: keyof TQuery,
    arrayNumber?: number[],
    tableName: string = this.entityName,
  ): this {
    const params = this.getParams();
    const value = arrayNumber || (this.query[nameQuery] as number[]);
    const columnToQuery = `${tableName}.${columnName.toString()}`;

    if (value) {
      this.queryBuilder.andWhere(
        `EXISTS (SELECT 1 FROM unnest(${columnToQuery}) AS provinceId WHERE provinceId = ANY(:${params}))`,
        {
          [params]: value,
        },
      );
    }

    return this;
  }

  /**
   * Thêm điều kiện tìm kiếm dựa trên một chuỗi văn bản (string) với chức năng ILIKE vào truy vấn.
   * @param {keyof T | keyof TQuery} name: Tên trường (cột) cần tìm kiếm - Required.
   * @param {string} valueString: Giá trị chuỗi văn bản cần tìm kiếm. Nếu không được cung cấp, hàm sẽ sử dụng giá trị từ Query - Optional.
   * @param {string} tableName: Tên bảng kiếm dựa trên một chuỗi - Optional, mặc định là tên bảng chính (this.entityName) - Optional.
   * @returns {this} Một tham chiếu đến đối tượng gọi hàm để hỗ trợ chuỗi gọi phương thức.
   */
  addString(
    name: keyof T | keyof TQuery,
    valueString?: string,
    tableName: string = this.entityName,
  ): this {
    const propertyName = String(name);
    const value = valueString || this.query[name];
    const params = this.getParams();

    if (value) {
      const columnToQuery = `${tableName}.${propertyName}`;
      this.queryBuilder.andWhere(
        `unaccent(LOWER(${columnToQuery})) ILIKE (LOWER(:${params}))`,
        {
          [params]: `%${value}%`,
        },
      );
    }
    return this;
  }

  addLikeString(
    name: keyof T | keyof TQuery,
    valueString?: string,
    tableName: string = this.entityName,
  ): this {
    const params = this.getParams();
    const propertyName = String(name);
    const value = valueString || this.query[name];

    if (value) {
      const columnToQuery = `${tableName}.${propertyName}`;
      this.queryBuilder.andWhere(`${columnToQuery} = :${params}`, {
        [params]: `${value}`,
      });
    }
    return this;
  }

  /**
   * Thêm điều kiện tìm kiếm dựa trên một chuỗi văn bản (string) với chức năng unaccent và ILIKE vào truy vấn.
   * @param {keyof T | keyof TQuery} name: Tên trường (cột) cần tìm kiếm - Required.
   * @param {string} valueString: Giá trị chuỗi văn bản cần tìm kiếm. Nếu không được cung cấp, hàm sẽ sử dụng giá trị từ Query - Optional.
   * @param {string} tableName: Tên bảng tìm kiếm dựa trên một chuỗi - Optional, mặc định là tên bảng chính (this.entityName) - Optional.
   * @returns {this} Một tham chiếu đến đối tượng gọi hàm để hỗ trợ chuỗi gọi phương thức.
   */
  addUnAccentString(
    nameQuery: keyof T | keyof TQuery,
    valueString?: string,
    tableName: string = this.entityName,
    name?: string,
  ): this {
    const params = this.getParams();
    const propertyName = name ? String(name) : String(nameQuery);
    const value = valueString || this.query[nameQuery];

    if (value) {
      const columnToQuery = `${tableName}.${propertyName}`;
      this.queryBuilder.andWhere(
        `unaccent(LOWER(${columnToQuery})) ILIKE unaccent(LOWER(:${params}))`,
        {
          [params]: `%${value}%`,
        },
      );
    }
    return this;
  }

  addUnAccentStringForJoinedTable(
    joinedTableName: string,
    name: string,
    nameQuery?: keyof T | keyof TQuery,
    valueString?: string,
  ): this {
    const params = this.getParams();
    const propertyName = name ? String(name) : String(nameQuery);
    const value = valueString || this.query[nameQuery];

    if (value) {
      const columnToQuery = `${joinedTableName}.${propertyName}`;

      this.queryBuilder.andWhere(
        `unaccent(LOWER(${columnToQuery})) ILIKE unaccent(LOWER(:${params}))`,
        {
          [params]: `%${value}%`,
        },
      );
    }
    return this;
  }

  addIsNotNull(
    name: keyof T | keyof TQuery,
    tableName: string = this.entityName,
  ): this {
    const propertyName = String(name);

    const columnToQuery = `${tableName}.${propertyName}`;
    console.log(`${columnToQuery} IS NOT NULL`);

    this.queryBuilder.andWhere(`${columnToQuery} IS NOT NULL`);

    return this;
  }

  /**
   * Thêm điều kiện tìm kiếm dựa trên một khoảng ngày từ một trường cụ thể trong cơ sở dữ liệu.
   * @param {string} dateName: Tên trường ngày cần tìm kiếm - Required.
   * @param {keyof T | keyof TQuery} startDateName: Tên trường thời gian bắt đầu - Required.
   * @param {keyof T | keyof TQuery} endDateName: Tên trường thời gian kết thúc - Required.
   * @param {Date} startDateValue: Giá trị thời gian bắt đầu. Nếu không được cung cấp, hàm sẽ sử dụng giá trị từ truy vấn - Optional.
   * @param {Date} endDateValue: Giá trị thời gian kết thúc. Nếu không được cung cấp, hàm sẽ sử dụng giá trị từ truy vấn - Optional.
   * @param {string} tableName: Tên bảng tìm kiếm dựa trên một khoảng ngày - Mặc định là tên bảng chính (this.entityName) - Optional.
   * @returns {this} Một tham chiếu đến đối tượng gọi hàm để hỗ trợ chuỗi gọi phương thức.
   */
  addDate(
    dateName: string,
    startDateName: keyof T | keyof TQuery,
    endDateName: keyof T | keyof TQuery,
    startDateValue?: Date,
    endDateValue?: Date,
    tableName: string = this.entityName,
  ): this {
    const columnToQuery = `${tableName}.${dateName}`;
    const startDate = startDateValue || this.query[startDateName];
    let endDate = endDateValue || (this.query[endDateName] as Date);

    if (startDate) {
      this.queryBuilder.andWhere(`${columnToQuery} >= :startDate`, {
        startDate,
      });
    }
    if (endDate) {
      endDate = addOneDay(endDate);
      this.queryBuilder.andWhere(`${columnToQuery} <= :endDate`, {
        endDate,
      });
    }

    return this;
  }

  /**
   * Thêm điều kiện phân trang vào truy vấn SQL.
   * @param {number} page: Số trang cần truy vấn - Mặc định là 1 - Optional
   * @param {number} perPage: Số mục trên mỗi trang - Mặc định là 10 - Optional
   * @param {boolean} getFull: Có lấy toàn bộ dữ liệu không - Mặc định là false - Optional
   * @returns {this} Một tham chiếu đến đối tượng gọi hàm để hỗ trợ chuỗi gọi phương thức.
   */
  addPagination(page?: number, perPage?: number, getFull?: boolean): this {
    const limit = perPage || this.query?.perPage || 10;
    const offset = (page - 1 || this.query?.page - 1 || 0) * limit;
    const isdPagination = getFull || this.query?.getFull || false;

    if (!isdPagination) {
      this.queryBuilder.skip(offset).take(limit);
    }
    return this;
  }

  /**
   * Thêm điều kiện sắp xếp vào truy vấn SQL.
   * @param {string} column: Tên cột cần sắp xếp theo - Required
   * @param {SORT_ENUM} sort: Hướng sắp xếp, giá trị mặc định là SORT_ENUM.DESC (giảm dần) - Optional
   * @param {string} tableName: Bảng mình muốn SORT - Mặc định là bảng chính - Optional
   * @returns {this} Một tham chiếu đến đối tượng gọi hàm để hỗ trợ chuỗi gọi phương thức.
   */
  sortBy(
    column: string,
    sort: SORT_ENUM = SORT_ENUM.DESC,
    tableName: string = this.entityName,
  ): this {
    if (this.query?.sort) sort = this.query?.sort;
    this.queryBuilder.addOrderBy(`${tableName}.${column}`, sort);
    return this;
  }

  /**
   * Lấy nhiều record và đếm số lượng
   * @returns {Promise<[T[], number]>} Một tham chiếu đến đối tượng gọi hàm để hỗ trợ chuỗi gọi phương thức.
   */
  getManyAndCount(): Promise<[T[], number]> {
    return this.queryBuilder.getManyAndCount();
  }

  /**
   * Lấy nhiều record
   * @returns {Promise<T[]>} Một tham chiếu đến đối tượng gọi hàm để hỗ trợ chuỗi gọi phương thức.
   */
  getMany(): Promise<T[]> {
    return this.queryBuilder.getMany();
  }

  /**
   * Lấy nhiều record và đếm số lượng
   * @returns {Promise<[T[], number]>} Một tham chiếu đến đối tượng gọi hàm để hỗ trợ chuỗi gọi phương thức.
   */
  getCount(): Promise<number> {
    return this.queryBuilder.getCount();
  }

  /**
   * Lấy một record
   * @returns {Promise<T>} Một tham chiếu đến đối tượng gọi hàm để hỗ trợ chuỗi gọi phương thức.
   */
  getOne(): Promise<T> {
    return this.queryBuilder.getOne();
  }
}
