export default class InvalidFieldError extends Error {
  constructor(args: any) {
    super(args);
    Error.captureStackTrace(this, InvalidFieldError);
  }
}
