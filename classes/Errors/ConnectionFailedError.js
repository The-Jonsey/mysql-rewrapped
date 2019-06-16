class ConnectionFailedError extends Error {
    constructor(args) {
        super(args);
        Error.captureStackTrace(this, ConnectionFailedError);
    }
}