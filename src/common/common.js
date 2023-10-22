import crypto from 'crypto';
export const Status = {
    OK: "OK",
    CREATED: "CREATED",
    INVALID: "INVALID",
    ERROR: "ERROR",
    NOT_FOUND: "NOT_FOUND",
    FAILED: "FAILED",
    INTERNAL_SERVER_ERROR: "INTERNAL_SERVER_ERROR",
    BAD_REQUEST: "BAD_REQUEST",
}

export const StatusCode = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UN_AUTHENTICATION: 401,
    UN_AUTHORIZATION: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    INTERNAL_SERVER: 500
}

export function hashPassword(password) {
    const hash = crypto.createHash('md5').update(password).digest('hex');
    return hash;
}

