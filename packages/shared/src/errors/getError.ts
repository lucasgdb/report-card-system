const getError = (errors: Error | Error[], errorCode: string): Error | null => {
  if (Array.isArray(errors)) {
    return errors.find((error) => error.message === errorCode) ?? null;
  }

  return errors.message === errorCode ? errors : null;
};

export default getError;
