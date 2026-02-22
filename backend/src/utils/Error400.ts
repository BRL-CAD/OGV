export const createError400 = (message: string) => {
  return {
    status: 400,
    success: false,
    message,
  };
};
