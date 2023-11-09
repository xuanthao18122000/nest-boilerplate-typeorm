import { ObjectLiteral, Repository, SelectQueryBuilder } from 'typeorm';
import { SORT_ENUM } from '../enums';
import { PaginationOptions } from './pagination-options.builder';

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

  addSelect(
    selectFields: string[],
    entityName: string = this.entityName,
  ): this {
    if (selectFields.length !== 0) {
      this.queryBuilder = this.queryBuilder.select(
        selectFields.map((field) => `${entityName}.${field}`),
      );
    }

    return this;
  }

  /**
   * Thêm một LEFT JOIN và chọn các trường cụ thể từ bảng được kết nối.
   * @param {string[]} selectFields: Các trường muốn select trong table leftJoin - Required
   * @param {string} leftJoinTable: Tên bảng trong mối quan hệ left join - Required
   * @param {string} mainTable: Tên của bảng chính - Optional , Optional, mặc định là tên bảng chính (this.entityName)
   * @returns {this} Một tham chiếu đến đối tượng gọi hàm để hỗ trợ chuỗi gọi phương thức
   */
  addLeftJoinAndSelect(
    selectFields: string[] = [],
    leftJoinTable: string,
    mainTable: string = this.entityName,
  ): this {
    this.queryBuilder.leftJoin(`${mainTable}.${leftJoinTable}`, leftJoinTable);

    if (selectFields.length > 0) {
      this.queryBuilder.addSelect(
        selectFields.map((field) => `${leftJoinTable}.${field}`),
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
   * @param {keyof TQuery} name: Tên trường cần tìm kiếm - Required.
   * @param {number} valueNumber: Giá trị số cần tìm kiếm. Nếu không được cung cấp, hàm sẽ sử dụng giá trị từ Query - Optional.
   * @param {string} leftJoinTable: Tên bảng tìm kiếm số- Optional, mặc định là tên bảng chính (this.entityName).
   * @returns {this} Một tham chiếu đến đối tượng gọi hàm để hỗ trợ chuỗi gọi phương thức.
   */
  addNumber(
    name: keyof TQuery,
    valueNumber?: number,
    leftJoinTable: string = this.entityName,
  ): this {
    const value = valueNumber || this.query[name];
    const columnToQuery = `${leftJoinTable}.${name.toString()}`;
    if (value) {
      this.queryBuilder.andWhere(`${columnToQuery} = :name`, { name: value });
    }
    return this;
  }

  /**
   * Thêm điều kiện tìm kiếm trong danh sách giá trị IN(array) vào truy vấn SQL.
   * @param {keyof TQuery} name: Tên trường cần tìm kiếm - bắt buộc.
   * @param {Array<number>} array: Mảng các giá trị để tìm kiếm. (Tùy chọn)
   * @param {string} leftJoinTable: Tên bảng tìm kiếm - tùy chọn, mặc định là tên bảng chính (this.entityName).
   * @returns {this} Một tham chiếu đến đối tượng gọi hàm để hỗ trợ chuỗi gọi phương thức.
   */
  addWhereIn(
    name: keyof TQuery,
    array: Array<number> = [],
    leftJoinTable: string = this.entityName,
  ): this {
    const columnToQuery = `${leftJoinTable}.${name.toString()}`;
    if (name) {
      this.queryBuilder.andWhere(`${columnToQuery} IN (:...values)`, {
        values: array,
      });
    }
    return this;
  }

  /**
   * Thêm điều kiện tìm kiếm dựa trên một chuỗi văn bản (string) với chức năng ILIKE vào truy vấn.
   * @param {keyof TQuery} name: Tên trường (cột) cần tìm kiếm - Required.
   * @param {string} valueString: Giá trị chuỗi văn bản cần tìm kiếm. Nếu không được cung cấp, hàm sẽ sử dụng giá trị từ Query - Optional.
   * @param {string} leftJoinTable: Tên bảng kiếm dựa trên một chuỗi - Optional, mặc định là tên bảng chính (this.entityName) - Optional.
   * @returns {this} Một tham chiếu đến đối tượng gọi hàm để hỗ trợ chuỗi gọi phương thức.
   */
  addString(
    name: keyof TQuery,
    valueString?: string,
    leftJoinTable: string = this.entityName,
  ): this {
    const propertyName = String(name);
    const value = valueString || this.query[name];

    if (value) {
      const columnToQuery = `${leftJoinTable}.${propertyName}`;
      this.queryBuilder.andWhere(
        `unaccent(LOWER(${columnToQuery})) ILIKE (LOWER(:${propertyName}))`,
        {
          [name]: `%${value}%`,
        },
      );
    }
    return this;
  }

  /**
   * Thêm điều kiện tìm kiếm dựa trên một chuỗi văn bản (string) với chức năng unaccent và ILIKE vào truy vấn.
   * @param {keyof TQuery} name: Tên trường (cột) cần tìm kiếm - Required.
   * @param {string} valueString: Giá trị chuỗi văn bản cần tìm kiếm. Nếu không được cung cấp, hàm sẽ sử dụng giá trị từ Query - Optional.
   * @param {string} leftJoinTable: Tên bảng tìm kiếm dựa trên một chuỗi - Optional, mặc định là tên bảng chính (this.entityName) - Optional.
   * @returns {this} Một tham chiếu đến đối tượng gọi hàm để hỗ trợ chuỗi gọi phương thức.
   */
  addUnAccentString(
    name: keyof TQuery,
    valueString?: string,
    leftJoinTable: string = this.entityName,
  ): this {
    const propertyName = String(name);
    const value = valueString || this.query[name];

    if (value) {
      const columnToQuery = `${leftJoinTable}.${propertyName}`;
      this.queryBuilder.andWhere(
        `unaccent(LOWER(${columnToQuery})) ILIKE unaccent(LOWER(:${propertyName}))`,
        {
          [name]: `%${value}%`,
        },
      );
    }
    return this;
  }

  /**
   * Thêm điều kiện tìm kiếm dựa trên một khoảng ngày từ một trường cụ thể trong cơ sở dữ liệu.
   * @param {string} dateName: Tên trường ngày cần tìm kiếm - Required.
   * @param {keyof TQuery} startDateName: Tên trường thời gian bắt đầu - Required.
   * @param {keyof TQuery} endDateName: Tên trường thời gian kết thúc - Required.
   * @param {Date} startDateValue: Giá trị thời gian bắt đầu. Nếu không được cung cấp, hàm sẽ sử dụng giá trị từ truy vấn - Optional.
   * @param {Date} endDateValue: Giá trị thời gian kết thúc. Nếu không được cung cấp, hàm sẽ sử dụng giá trị từ truy vấn - Optional.
   * @param {string} leftJoinTable: Tên bảng tìm kiếm dựa trên một khoảng ngày - Mặc định là tên bảng chính (this.entityName) - Optional.
   * @returns {this} Một tham chiếu đến đối tượng gọi hàm để hỗ trợ chuỗi gọi phương thức.
   */
  addDate(
    dateName: string,
    startDateName: keyof TQuery,
    endDateName: keyof TQuery,
    startDateValue?: Date,
    endDateValue?: Date,
    leftJoinTable: string = this.entityName,
  ): this {
    const columnToQuery = `${leftJoinTable}.${dateName}`;
    const startDate = startDateValue || this.query[startDateName];
    const endDate = endDateValue || this.query[endDateName];

    if (startDate) {
      this.queryBuilder.andWhere(`${columnToQuery} >= :startDate`, {
        startDate,
      });
    }
    if (endDate) {
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
    const limit = perPage || this.query.perPage || 10;
    const offset = (page - 1 || this.query.page - 1 || 0) * limit;
    const isdPagination = getFull || this.query.getFull || false;

    if (!isdPagination) {
      this.queryBuilder.skip(offset).take(limit);
    }
    return this;
  }

  /**
   * Thêm điều kiện sắp xếp vào truy vấn SQL.
   * @param {string} column: Tên cột cần sắp xếp theo - Required
   * @param {SORT_ENUM} sort: Hướng sắp xếp, giá trị mặc định là SORT_ENUM.DESC (giảm dần) - Optional
   * @returns {this} Một tham chiếu đến đối tượng gọi hàm để hỗ trợ chuỗi gọi phương thức.
   */
  sortBy(column: string, sort: SORT_ENUM = SORT_ENUM.DESC): this {
    if (this.query.sort) sort = this.query.sort;
    this.queryBuilder.addOrderBy(`${this.entityName}.${column}`, sort);
    return this;
  }
}
