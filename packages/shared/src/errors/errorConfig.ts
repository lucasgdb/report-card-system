const errorConfig = {
  user: {
    code: 'USER_DEFAULT_ERROR',
    message: 'Unexpected error while trying to get user',
    unauthenticated: {
      code: 'USER_UNAUTHENTICATED',
      message: 'user was not authenticated when request was made',
    },
  },
  student: {
    code: 'STUDENT_DEFAULT_ERROR',
    message: 'Unexpected error while trying to get student',
    notFound: {
      code: 'STUDENT_NOT_FOUND',
      message: 'Requested student was not found on the system',
    },
  },
  admin: {
    code: 'ADMIN_DEFAULT_ERROR',
    message: 'Unexpected error while trying to get admin',
    notFound: {
      code: 'ADMIN_NOT_FOUND',
      message: 'Requested admin was not found on the system',
    },
  },
  studentPasswordRecoveryRequest: {
    code: 'STUDENT_PASSWORD_RECOVERY_REQUEST_DEFAULT_ERROR',
    message: 'Unexpected error while trying to get the request',
    notFound: {
      code: 'STUDENT_PASSWORD_RECOVERY_REQUEST_NOT_FOUND',
      message: 'Requested student password recovery not found on the system',
    },
  },
};

export default errorConfig;
