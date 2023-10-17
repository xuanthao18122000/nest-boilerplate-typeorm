export interface StatusCodeConfig {
  [key: string]: { code: number; type: string; msg: string };
}

const statusCode: StatusCodeConfig = {
  BACKEND: { code: 500, type: 'ERROR_BACKEND', msg: 'Error Backend!' },
  BAD_REQUEST: { code: 400, type: 'BAD_REQUEST', msg: 'Bad Request!' },
  UNAUTHORIZED: { code: 401, type: 'UNAUTHORIZED', msg: 'Unauthorized!' },
  LOGIN_ERROR: { code: 402, type: 'LOGIN_ERROR', msg: 'Login Error!' },
  FORBIDDEN: { code: 403, type: 'FORBIDDEN', msg: 'Forbidden!' },
  NOT_FOUND: { code: 404, type: 'NOT_FOUND', msg: 'Not Found!' },
  WRONG_DATA: { code: 409, type: 'WRONG_DATA', msg: 'Your data is wrong!' },
  NOT_ENOUGH_DATA: {
    code: 410,
    type: 'NOT_ENOUGH_DATA',
    msg: 'Your data is not enough!',
  },
  VALIDATION_ERROR: { code: 422, type: 'VALIDATION_ERROR', msg: 'Validation Error!' },

  // USER STATUS
  USER_EXISTED: {
    code: 1000,
    type: 'USER_EXISTED',
    msg: 'User already exists!',
  },
  USER_NOT_FOUND: {
    code: 1001,
    type: 'USER_NOT_FOUND',
    msg: 'User not found!',
  },
  WRONG_PASSWORD: {
    code: 1002,
    type: 'WRONG_PASSWORD',
    msg: 'Your password is wrong!',
  },
  USER_INACTIVE: {
    code: 1003,
    type: 'USER_INACTIVE',
    msg: 'User is inactive!',
  },
};
export default statusCode;
