"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const date_1 = __importDefault(require("@joi/date"));
const JoiExtended = joi_1.default.extend(date_1.default);
const validationMessages_1 = __importDefault(require("../Utils/validationMessages"));
const loginValidation = joi_1.default.object({
    userName: joi_1.default.string()
        .required()
        .messages({
        "string.base": validationMessages_1.default.STRING_BASE.replace("ADD:", "User name"),
        "string.empty": validationMessages_1.default.STRING_EMPTY.replace("ADD:", "User name"),
        "any.required": validationMessages_1.default.REQUIRED.replace("ADD:", "User name"),
    }),
    password: joi_1.default.string()
        .required()
        .min(6)
        .max(20)
        .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\\-=[\\]{};':\",./<>?])"))
        .messages({
        "string.base": validationMessages_1.default.STRING_BASE.replace("ADD:", "Password"),
        "any.required": validationMessages_1.default.REQUIRED.replace("ADD:", "Password"),
        "string.min": validationMessages_1.default.STRING_MIN.replace("ADD:", "Password"),
        "string.max": validationMessages_1.default.STRING_MAX.replace("ADD:", "Password"),
        "string.pattern.base": "Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character.",
    }),
});
const idValidation = joi_1.default.object({
    id: joi_1.default.string()
        .required()
        .messages({
        "string.base": validationMessages_1.default.STRING_BASE.replace("ADD:", "Id"),
        "string.empty": validationMessages_1.default.STRING_EMPTY.replace("ADD:", "Id"),
        "any.required": validationMessages_1.default.REQUIRED.replace("ADD:", "Id"),
    }),
});
const commentValidation = joi_1.default.object({
    id: joi_1.default.string()
        .required()
        .messages({
        "string.base": validationMessages_1.default.STRING_BASE.replace("ADD:", "Id"),
        "string.empty": validationMessages_1.default.STRING_EMPTY.replace("ADD:", "Id"),
        "any.required": validationMessages_1.default.REQUIRED.replace("ADD:", "Id"),
    }),
    comment: joi_1.default.string()
        .required()
        .messages({
        "string.base": validationMessages_1.default.STRING_BASE.replace("ADD:", "Comment"),
        "string.empty": validationMessages_1.default.STRING_EMPTY.replace("ADD:", "Comment"),
        "any.required": validationMessages_1.default.REQUIRED.replace("ADD:", "Comment"),
    }),
});
const styleValidation = joi_1.default.object({
    tattooStyle: joi_1.default.string()
        .required()
        .messages({
        "string.base": validationMessages_1.default.STRING_BASE.replace("ADD:", "Tattoo style"),
        "string.empty": validationMessages_1.default.STRING_EMPTY.replace("ADD:", "Tattoo style"),
        "any.required": validationMessages_1.default.REQUIRED.replace("ADD:", "Tattoo style"),
    }),
});
exports.default = {
    loginValidation,
    idValidation,
    commentValidation,
    styleValidation,
};
