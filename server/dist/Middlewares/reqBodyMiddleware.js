"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const responseMessages_1 = require("../Utils/responseMessages");
const requestBodyMiddleware = (validationSchema) => {
    return (req, res, next) => {
        const validationResult = validationSchema.validate(req.body, {
            abortEarly: false,
        });
        if (validationResult.error) {
            const errMessage = validationResult.error.details[0].message;
            res.send((0, responseMessages_1.errorResponse)(errMessage));
        }
        else {
            next();
        }
    };
};
exports.default = requestBodyMiddleware;
