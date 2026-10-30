// Codes of the errors the server throws outside mutations' `error` payload (e.g. authentication).
const errorConfig = {
  user: {
    unauthenticated: {
      code: 'USER_UNAUTHENTICATED',
      message: 'user was not authenticated when request was made',
    },
  },
};

export default errorConfig;
