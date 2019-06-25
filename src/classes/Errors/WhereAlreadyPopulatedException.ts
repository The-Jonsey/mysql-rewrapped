export default class WhereAlreadyPopulatedException extends Error {
  constructor(args: any = "") {
    super(args);
    Error.captureStackTrace(this, WhereAlreadyPopulatedException);
  }
}
