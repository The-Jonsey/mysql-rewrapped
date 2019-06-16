class InvalidFieldError extends Error {
    constructor(args) {
        super(args);
        Error.captureStackTrace(this, InvalidFieldError);
    }
}