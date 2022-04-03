const errorConfig = {
  user: {
    code: 'USER_DEFAULT_ERROR',
    message: 'Unexpected error while trying to get user',
    notFound: {
      code: 'USER_NOT_FOUND',
      message: 'Requested user was not found on the system',
    },
    unauthenticated: {
      code: 'USER_UNAUTHENTICATED',
      message: 'User was not authenticated when request was made',
    },
    duplicatedEmail: {
      code: 'EMAIL_ALREADY_EXISTS',
      message: 'This email already exists',
    },
  },
};

export default errorConfig;
