class WhereAlreadyPopulatedException extends Error {
    constructor(args) {
        super(args);
        Error.captureStackTrace(this, WhereAlreadyPopulatedException);
    }
}