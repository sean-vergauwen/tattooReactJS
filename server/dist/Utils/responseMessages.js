"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorResponse = exports.successResponse = void 0;
const successResponse = (data, code, msg) => {
    return {
        success: true,
        statusCode: code,
        message: msg,
        data: data,
    };
};
exports.successResponse = successResponse;
const errorResponse = (errMessage, code) => {
    return {
        success: false,
        statusCode: code || 400,
        message: errMessage,
        data: null,
    };
};
exports.errorResponse = errorResponse;
