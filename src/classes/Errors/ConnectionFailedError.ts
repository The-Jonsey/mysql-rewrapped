export default class ConnectionFailedError extends Error {
  constructor(args: any = "") {
    super(args);
    Error.captureStackTrace(this, ConnectionFailedError);
  }
}
