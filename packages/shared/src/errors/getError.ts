const getError = (errors: Error | Error[], errorCode: string) => {
  if (Array.isArray(errors)) {
    return errors.find((error) => error.message === errorCode) ?? null;
  }

  return errors.message === errorCode ? errors : null;
};

export default getError;
