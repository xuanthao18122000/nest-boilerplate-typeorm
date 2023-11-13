import { SuccessSwaggerResponse } from 'src/common/utils';

/* =============== CREATE EMPLOYEE ================== */
export const SuccessCreateEmployeeResponse = {
  description: 'Success!',
  schema: {
    example: SuccessSwaggerResponse(
      {
        id: 1,
        email: 'admin@gmail.com',
        fullName: 'Admin',
        phoneNumber: '097392738',
        gender: 1,
        status: 1,
        roleId: 1,
        createdAt: '2023-10-08T04:04:04.434Z',
        updatedAt: '2023-11-12T04:17:43.816Z',
      },
      'Create employee successful!',
    ),
  },
};

export const ExistedCreateEmployeeResponse = {
  description: 'Employee Already Exists!',
  schema: {
    example: {
      code: 1000,
      success: false,
      type: 'EMPLOYEE_EXISTED',
      msg: 'Employee already exists!',
    },
  },
};

/* =============== LIST EMPLOYEE ================== */
export const SuccessListEmployeeResponse = {
  description: 'Success!',
  schema: {
    example: SuccessSwaggerResponse(
      {
        list: [
          {
            id: 1,
            createdAt: '2023-10-08T04:04:04.434Z',
            updatedAt: '2023-11-11T12:09:35.075Z',
            email: 'admin@gmail.com',
            fullName: 'Admin',
            phoneNumber: '097392738',
            gender: 1,
            avatar: 'avatar.png',
            role: 1,
          },
        ],
        total: 1,
        page: 1,
        perPage: 10,
      },
      'Get all employee successful!',
    ),
  },
};

/* =============== DETAIL EMPLOYEE ================== */
export const SuccessDetailEmployeeResponse = {
  description: 'Success!',
  schema: {
    example: SuccessSwaggerResponse(
      {
        id: 1,
        createdAt: '2023-10-08T04:04:04.434Z',
        updatedAt: '2023-11-11T12:09:35.075Z',
        email: 'admin@gmail.com',
        fullName: 'Admin',
        phoneNumber: '097392738',
        gender: 1,
        avatar: 'avatar.png',
        role: 1,
      },
      'Get detail employee successful!',
    ),
  },
};

export const NotFoundDetailEmployeeResponse = {
  description: 'Employee Not Found!',
  schema: {
    example: {
      code: 1001,
      success: false,
      type: 'EMPLOYEE_NOT_FOUND',
      msg: 'Employee not found!',
    },
  },
};

/* =============== UPDATE EMPLOYEE ================== */
export const SuccessUpdateEmployeeResponse = {
  description: 'Success!',
  schema: {
    example: SuccessSwaggerResponse(
      {
        id: 1,
        createdAt: '2023-10-08T04:04:04.434Z',
        updatedAt: '2023-11-11T12:09:35.075Z',
        email: 'admin@gmail.com',
        fullName: 'Admin',
        phoneNumber: '097392738',
        gender: 1,
        avatar: 'avatar.png',
        role: 1,
      },
      'Update employee successful!',
    ),
  },
};
