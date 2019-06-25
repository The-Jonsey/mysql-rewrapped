export default class InvalidJoinTypeError extends Error {
  constructor(args: any) {
    super(args);
    Error.captureStackTrace(this, InvalidJoinTypeError);
  }
}
