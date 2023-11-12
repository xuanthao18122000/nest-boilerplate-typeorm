import { SuccessSwaggerResponse } from 'src/common/utils';

/* =============== LOGIN ================== */
export const SuccessLoginResponse = {
  description: 'Success!',
  schema: {
    example: SuccessSwaggerResponse(
      {
        user: {
          id: 1,
          email: 'admin@gmail.com',
          fullName: 'Admin',
          phoneNumber: '097392738',
          gender: 1,
          status: 1,
          roleId: 1,
          createdAt: '2023-10-08T04:04:04.434Z',
          updatedAt: '2023-11-11T12:09:35.075Z',
        },
        token:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBnbWFpbC5jb20iLCJpYXQiOjE2OTk3MDQ1NzUsImV4cCI6MTY5OTc5MDk3NX0.HCxlekG9YFzeBydgjofEKAelBEJtR77G_7mFN14xCk8',
        expiresIn: '1d',
      },
      'Sign in user successful!',
    ),
  },
};

export const NotFoundLoginResponse = {
  description: 'User Not Found!',
  schema: {
    example: {
      code: 1001,
      success: false,
      type: 'USER_NOT_FOUND',
      msg: 'User not found!',
    },
  },
};

export const WrongPasswordLoginResponse = {
  description: 'Incorrect Password!',
  schema: {
    example: {
      code: 1002,
      success: false,
      type: 'WRONG_PASSWORD',
      msg: 'Your password is wrong!',
    },
  },
};

/* =============== REGISTER ================== */
export const SuccessRegisterResponse = {
  description: 'Success!',
  schema: {
    example: SuccessSwaggerResponse(
      {
        id: 2,
        email: 'admin1@gmail.com',
        fullName: 'Admin',
        phoneNumber: '123456789',
        gender: 1,
        status: 1,
        roleId: null,
        createdAt: '2023-11-12T04:10:47.096Z',
        updatedAt: '2023-11-12T04:10:47.096Z',
      },
      'Sign up user successful!',
    ),
  },
};

export const ExistedRegisterResponse = {
  description: 'User Already Exists!',
  schema: {
    example: {
      code: 1000,
      success: false,
      type: 'USER_EXISTED',
      msg: 'User already exists!',
    },
  },
};

/* =============== LOGOUT ================== */
export const SuccessLogoutResponse = {
  description: 'Success!',
  schema: {
    example: SuccessSwaggerResponse([], 'Sign out user successful!'),
  },
};

/* =============== GET PROFILE ================== */
export const SuccessGetProfileResponse = {
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
      'Get profile user successful!',
    ),
  },
};

/* =============== UPDATE PROFILE ================== */
export const SuccessUpdateProfileResponse = {
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
      'Update profile user successful!',
    ),
  },
};
