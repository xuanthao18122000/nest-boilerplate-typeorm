import { HttpStatus } from '@nestjs/common';
import { ErrorHttpException } from 'src/common/exceptions/throw.exception';
import { SuccessSwaggerResponse } from 'src/common/utils';

/* =============== CREATE USER ================== */
export const SuccessCreateUserResponse = {
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
      'Create user successful!',
    ),
  },
};

export const ExistedCreateUserResponse = {
  description: 'User Already Exists!',
  schema: {
    example: ErrorHttpException(
      HttpStatus.CONFLICT,
      'USER_EXISTED',
    ).getResponse(),
  },
};

/* =============== LIST USER ================== */
export const SuccessListUserResponse = {
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
      'Get all users successful!',
    ),
  },
};

/* =============== DETAIL USER ================== */
export const SuccessDetailUserResponse = {
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
      'Get detail user successful!',
    ),
  },
};

export const NotFoundDetailUserResponse = {
  description: 'User Not Found!',
  schema: {
    example: ErrorHttpException(
      HttpStatus.NOT_FOUND,
      'USER_NOT_FOUND',
    ).getResponse(),
  },
};

/* =============== UPDATE USER ================== */
export const SuccessUpdateUserResponse = {
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
      'Update user successful!',
    ),
  },
};
