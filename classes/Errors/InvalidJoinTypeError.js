class InvalidJoinTypeError extends Error {
    constructor(args) {
        super(args);
        Error.captureStackTrace(this, InvalidJoinTypeError);
    }
}