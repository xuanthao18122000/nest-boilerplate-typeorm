const statusCode = {
  BACKEND: { code: 500, type: 'ERROR_BACKEND', msg: 'Error Backend!' },
  BAD_REQUEST: { code: 400, type: 'BAD_REQUEST' },
  UNAUTHORIZED: { code: 401, type: 'UNAUTHORIZED', msg: 'Unauthorized!' },
  LOGIN_ERROR: { code: 402, type: 'LOGIN_ERROR' },
  FORBIDDEN: { code: 403, type: 'FORBIDDEN', msg: 'Forbidden!' },
  NOT_FOUND: { code: 404, type: 'NOT_FOUND' },
  WRONG_DATA: { code: 409, type: 'WRONG_DATA', msg: 'Your data is wrong!' },
  NOT_ENOUGH_DATA: {
    code: 410,
    type: 'NOT_ENOUGH_DATA',
    msg: 'Your data is not enough!',
  },
  VALIDATION_ERROR: { code: 422, type: 'VALIDATION_ERROR' },

  // USER
  USER_EXISTED: { code: 1000, type: 'USER_EXISTED' },
  USER_NOT_FOUND: { code: 1001, type: 'USER_NOT_FOUND' },
  WRONG_PASSWORD: { code: 1002, type: 'WRONG_PASSWORD' },
  USER_INACTIVE: { code: 1003, type: 'USER_INACTIVE' },

};
export default statusCode;
