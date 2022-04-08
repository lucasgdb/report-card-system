type RequiredExceptFor<T, TOptinal extends keyof T = keyof T> = Required<Pick<T, Exclude<keyof T, TOptinal>>> &
  Partial<Pick<T, TOptinal>>;

export default RequiredExceptFor;
