export interface StatusCodeConfig {
  [key: string]: { code: number; type: string; msg: string };
}

const statusCode: StatusCodeConfig = {
  BACKEND: {
    code: 500,
    type: 'ERROR_BACKEND',
    msg: 'Hệ thông đang có vấn đề, thử lại sau!',
  },
  BAD_REQUEST: { code: 400, type: 'BAD_REQUEST', msg: 'Yêu cầu không hợp lệ!' },
  UNAUTHORIZED: {
    code: 401,
    type: 'UNAUTHORIZED',
    msg: 'Không được phép truy cập!',
  },
  FORBIDDEN: {
    code: 403,
    type: 'FORBIDDEN',
    msg: 'Bạn không có quyền truy cập!',
  },
  NOT_FOUND: { code: 404, type: 'NOT_FOUND', msg: 'Không tìm thấy!' },
  WRONG_DATA: { code: 409, type: 'WRONG_DATA', msg: 'Lỗi sai dữ liệu!' },

  // USER STATUS
  USER_EXISTED: {
    code: 1000,
    type: 'USER_EXISTED',
    msg: 'Email người dùng đã tồn tại!',
  },
  USER_NOT_FOUND: {
    code: 1001,
    type: 'USER_NOT_FOUND',
    msg: 'Không tìm thấy người dùng!',
  },
  USER_INACTIVE: {
    code: 1003,
    type: 'USER_INACTIVE',
    msg: 'Người dùng không hoạt động!',
  },
  USER_LOCKED: {
    code: 1004,
    type: 'USER_LOCKED',
    msg: 'Người dùng đã bị khóa, bạn không thể chỉnh sửa!',
  },

  // STAFF STATUS
  STAFF_EXISTED: {
    code: 1030,
    type: 'STAFF_EXISTED',
    msg: 'Email nhân viên đã tồn tại!',
  },
  STAFF_NOT_FOUND: {
    code: 1031,
    type: 'STAFF_NOT_FOUND',
    msg: 'Không tìm thấy nhân viên!',
  },
  STAFF_LOCKED: {
    code: 1032,
    type: 'STAFF_LOCKED',
    msg: 'Nhân viên đã bị khóa, bạn không thể chỉnh sửa!',
  },
  SALE_HEAD_NOT_FOUND: {
    code: 1033,
    type: 'SALE_HEAD_NOT_FOUND',
    msg: 'Không tìm thấy trưởng phòng!',
  },

  // POSITION STATUS
  POSITION_EXISTED: {
    code: 1040,
    type: 'POSITION_EXISTED',
    msg: 'Tên chức vụ đã tồn tại!',
  },
  POSITION_NOT_FOUND: {
    code: 1041,
    type: 'POSITION_NOT_FOUND',
    msg: 'Không tìm thấy chức vụ!',
  },

  // AREA STATUS
  AREA_EXISTED: {
    code: 1050,
    type: 'AREA_EXISTED',
    msg: 'Tên khu vực đã tồn tại!',
  },
  AREA_NOT_FOUND: {
    code: 1051,
    type: 'AREA_NOT_FOUND',
    msg: 'Không tìm thấy khu vực!',
  },

  // ROU STATUS
  ROU_EXISTED: {
    code: 1060,
    type: 'ROU_EXISTED',
    msg: 'Tên ROU đã tồn tại!',
  },
  ROU_NOT_FOUND: {
    code: 1061,
    type: 'ROU_NOT_FOUND',
    msg: 'Không tìm thấy ROU!',
  },

  // OD STATUS
  OD_EXISTED: {
    code: 1070,
    type: 'OD_EXISTED',
    msg: 'Tên nhà phân phối đã tồn tại!',
  },
  OD_NOT_FOUND: {
    code: 1071,
    type: 'OD_NOT_FOUND',
    msg: 'Không tìm thấy nhà phân phối!',
  },
  STAFF_NOT_MANAGE_OD: {
    code: 1072,
    type: 'STAFF_NOT_MANAGE_OD',
    msg: 'Nhân viên không quản lý cửa hàng này!',
  },

  // RETAILER STATUS
  RETAILER_EXISTED: {
    code: 1080,
    type: 'RETAILER_EXISTED',
    msg: 'Tên cửa hàng bán lẻ đã tồn tại!',
  },
  RETAILER_NOT_FOUND: {
    code: 1081,
    type: 'RETAILER_NOT_FOUND',
    msg: 'Không tìm thấy cửa hàng bán lẻ!',
  },

  // POTENTIAL_CUSTOMER STATUS
  POTENTIAL_CUSTOMER_EXISTED: {
    code: 1090,
    type: 'POTENTIAL_CUSTOMER_EXISTED',
    msg: 'Tên cửa hàng tiềm năng đã tồn tại!',
  },
  POTENTIAL_CUSTOMER_NOT_FOUND: {
    code: 1091,
    type: 'POTENTIAL_CUSTOMER_NOT_FOUND',
    msg: 'Không tìm thấy cửa hàng tiềm năng!',
  },

  // OTHER_CUSTOMER STATUS
  OTHER_CUSTOMER_EXISTED: {
    code: 1100,
    type: 'OTHER_CUSTOMER_EXISTED',
    msg: 'Tên cửa hàng khác đã tồn tại!',
  },
  OTHER_CUSTOMER_NOT_FOUND: {
    code: 1101,
    type: 'OTHER_CUSTOMER_NOT_FOUND',
    msg: 'Không tìm thấy cửa hàng khác!',
  },

  // VISITING_HISTORY STATUS
  VISITING_HISTORY_NOT_FOUND: {
    code: 1110,
    type: 'VISITING_HISTORY_NOT_FOUND',
    msg: 'Không tìm thấy lịch sử di chuyển!',
  },

  // PROMOTION STATUS
  PROMOTION_EXISTED: {
    code: 1120,
    type: 'PROMOTION_EXISTED',
    msg: 'Tên khuyến mãi đã tồn tại!',
  },
  PROMOTION_NOT_FOUND: {
    code: 1121,
    type: 'PROMOTION_NOT_FOUND',
    msg: 'Không tìm thấy khuyến mãi!',
  },

  // PRODUCT STATUS
  PRODUCT_EXISTED: {
    code: 1130,
    type: 'PRODUCT_EXISTED',
    msg: 'Tên sản phẩm đã tồn tại!',
  },
  PRODUCT_NOT_FOUND: {
    code: 1131,
    type: 'PRODUCT_NOT_FOUND',
    msg: 'Không tìm thấy sản phẩm!',
  },

  // LOCATION LOOKUP STATUS
  LOCATION_LOOKUP_NOT_FOUND: {
    code: 1140,
    type: 'LOCATION_LOOKUP_NOT_FOUND',
    msg: 'Không tìm thấy tra cứu vị trí!',
  },

  // PROVINCE STATUS
  PROVINCE_NOT_FOUND: {
    code: 1150,
    type: 'PROVINCE_NOT_FOUND',
    msg: 'Không tìm thấy tỉnh thành!',
  },
  DISTRICT_NOT_FOUND: {
    code: 1151,
    type: 'DISTRICT_NOT_FOUND',
    msg: 'Không tìm thấy quận huyện!',
  },
  WARD_NOT_FOUND: {
    code: 1152,
    type: 'WARD_NOT_FOUND',
    msg: 'Không tìm thấy xã thị trấn!',
  },

  // KPI STATUS
  KPI_NOT_FOUND: {
    code: 1160,
    type: 'KPI_NOT_FOUND',
    msg: 'Không tìm thấy KPI!',
  },

  // RBAC STATUS
  ROLE_NOT_FOUND: {
    code: 1170,
    type: 'ROLE_NOT_FOUND',
    msg: 'Không tìm thấy action!',
  },
  ROLE_NAME_EXISTED: {
    code: 1171,
    type: 'ROLE_NAME_EXISTED',
    msg: 'Tên role đã tồn tại!',
  },

  // RBAC STATUS
  RBAC_ACTION_NOT_FOUND: {
    code: 1180,
    type: 'RBAC_ACTION_NOT_FOUND',
    msg: 'Không tìm thấy action!',
  },
  RBAC_MODULE_NOT_FOUND: {
    code: 1181,
    type: 'RBAC_MODULE_NOT_FOUND',
    msg: 'Không tìm thấy module!',
  },

  // BRAND STATUS
  BRAND_NOT_FOUND: {
    code: 1190,
    type: 'BRAND_NOT_FOUND',
    msg: 'Không tìm thấy thương hiệu!',
  },
  BRAND_NAME_EXISTED: {
    code: 1191,
    type: 'BRAND_NAME_EXISTED',
    msg: 'Tên thương hiệu đã tồn tại!!',
  },

  // EXPORT STATUS
  EXPORT_NOT_FOUND: {
    code: 1500,
    type: 'EXPORT_NOT_FOUND',
    msg: 'Không tìm thấy lịch sử xuất dữ liệu!',
  },
};
export default statusCode;

// const STATUS = {
//   LIST: [
//     {
//       code: 500,
//       type: 'ERROR_BACKEND',
//       msg: 'Hệ thông đang có vấn đề, thử lại sau!',
//     },
//     { code: 400, type: 'BAD_REQUEST', msg: 'Yêu cầu không hợp lệ!' },
//     {
//       code: 401,
//       type: 'UNAUTHORIZED',
//       msg: 'Không được phép truy cập!',
//     },
//   ],
//   OBJECT() {
//     return _.keyBy(this.LIST, 'type');
//   },
// };

// console.log(STATUS.OBJECT().ERROR_BACKEND);
