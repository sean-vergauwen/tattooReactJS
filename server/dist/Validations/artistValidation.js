"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const date_1 = __importDefault(require("@joi/date"));
const JoiExtended = joi_1.default.extend(date_1.default);
const validationMessages_1 = __importDefault(require("../Utils/validationMessages"));
const registrationValidation = joi_1.default.object({
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
    address: joi_1.default.string()
        .required()
        .messages({
        "string.base": validationMessages_1.default.STRING_BASE.replace("ADD:", "Address"),
        "string.empty": validationMessages_1.default.STRING_EMPTY.replace("ADD:", "Address"),
        "any.required": validationMessages_1.default.REQUIRED.replace("ADD:", "Address"),
    }),
    website: joi_1.default.string()
        .required()
        .messages({
        "string.base": validationMessages_1.default.STRING_BASE.replace("ADD:", "Website"),
        "string.empty": validationMessages_1.default.STRING_EMPTY.replace("ADD:", "Website"),
        "any.required": validationMessages_1.default.REQUIRED.replace("ADD:", "Website"),
    }),
    tattooStyle: joi_1.default.string()
        .required()
        .messages({
        "string.base": validationMessages_1.default.STRING_BASE.replace("ADD:", "Tattoo style"),
        "string.empty": validationMessages_1.default.STRING_EMPTY.replace("ADD:", "Tattoo style"),
        "any.required": validationMessages_1.default.REQUIRED.replace("ADD:", "Tattoo style"),
    }),
});
const addTattooValidation = joi_1.default.object({
    name: joi_1.default.string()
        .required()
        .messages({
        "string.base": validationMessages_1.default.STRING_BASE.replace("ADD:", "Name"),
        "string.empty": validationMessages_1.default.STRING_EMPTY.replace("ADD:", "Name"),
        "any.required": validationMessages_1.default.REQUIRED.replace("ADD:", "Name"),
    }),
    description: joi_1.default.string()
        .required()
        .messages({
        "string.base": validationMessages_1.default.STRING_BASE.replace("ADD:", "Description"),
        "string.empty": validationMessages_1.default.STRING_EMPTY.replace("ADD:", "Description"),
        "any.required": validationMessages_1.default.REQUIRED.replace("ADD:", "Description"),
    }),
    tattooStyle: joi_1.default.string()
        .required()
        .messages({
        "string.base": validationMessages_1.default.STRING_BASE.replace("ADD:", "tattooStyle"),
        "string.empty": validationMessages_1.default.STRING_EMPTY.replace("ADD:", "tattooStyle"),
        "any.required": validationMessages_1.default.REQUIRED.replace("ADD:", "tattooStyle"),
    }),
});
exports.default = { registrationValidation, addTattooValidation };
