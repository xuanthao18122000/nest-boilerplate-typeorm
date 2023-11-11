export const SuccessSwaggerResponse = <T>(data: T, msg = 'Success!') => {
  return {
    code: 200,
    success: true,
    data: data,
    msg: msg,
  };
};
