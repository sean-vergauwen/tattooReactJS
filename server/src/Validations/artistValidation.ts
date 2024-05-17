import Joi from "joi";
import JoiDate from "@joi/date";
const JoiExtended = Joi.extend(JoiDate);
import validationMessages from "../Utils/validationMessages";

const registrationValidation = Joi.object({
  userName: Joi.string()
    .required()
    .messages({
      "string.base": validationMessages.STRING_BASE.replace(
        "ADD:",
        "User name"
      ),
      "string.empty": validationMessages.STRING_EMPTY.replace(
        "ADD:",
        "User name"
      ),
      "any.required": validationMessages.REQUIRED.replace("ADD:", "User name"),
    }),
  password: Joi.string()
    .required()
    .min(6)
    .max(20)
    .pattern(
      new RegExp(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\\-=[\\]{};':\",./<>?])"
      )
    )
    .messages({
      "string.base": validationMessages.STRING_BASE.replace("ADD:", "Password"),
      "any.required": validationMessages.REQUIRED.replace("ADD:", "Password"),
      "string.min": validationMessages.STRING_MIN.replace("ADD:", "Password"),
      "string.max": validationMessages.STRING_MAX.replace("ADD:", "Password"),
      "string.pattern.base":
        "Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character.",
    }),

  address: Joi.string()
    .required()
    .messages({
      "string.base": validationMessages.STRING_BASE.replace("ADD:", "Address"),
      "string.empty": validationMessages.STRING_EMPTY.replace(
        "ADD:",
        "Address"
      ),
      "any.required": validationMessages.REQUIRED.replace("ADD:", "Address"),
    }),
  website: Joi.string()
    .required()
    .messages({
      "string.base": validationMessages.STRING_BASE.replace("ADD:", "Website"),
      "string.empty": validationMessages.STRING_EMPTY.replace(
        "ADD:",
        "Website"
      ),
      "any.required": validationMessages.REQUIRED.replace("ADD:", "Website"),
    }),
  tattooStyle: Joi.string()
    .required()
    .messages({
      "string.base": validationMessages.STRING_BASE.replace(
        "ADD:",
        "Tattoo style"
      ),
      "string.empty": validationMessages.STRING_EMPTY.replace(
        "ADD:",
        "Tattoo style"
      ),
      "any.required": validationMessages.REQUIRED.replace(
        "ADD:",
        "Tattoo style"
      ),
    }),
});

const addTattooValidation = Joi.object({
  name: Joi.string()
    .required()
    .messages({
      "string.base": validationMessages.STRING_BASE.replace("ADD:", "Name"),
      "string.empty": validationMessages.STRING_EMPTY.replace("ADD:", "Name"),
      "any.required": validationMessages.REQUIRED.replace("ADD:", "Name"),
    }),
  description: Joi.string()
    .required()
    .messages({
      "string.base": validationMessages.STRING_BASE.replace(
        "ADD:",
        "Description"
      ),
      "string.empty": validationMessages.STRING_EMPTY.replace(
        "ADD:",
        "Description"
      ),
      "any.required": validationMessages.REQUIRED.replace(
        "ADD:",
        "Description"
      ),
    }),
  tattooStyle: Joi.string()
    .required()
    .messages({
      "string.base": validationMessages.STRING_BASE.replace(
        "ADD:",
        "tattooStyle"
      ),
      "string.empty": validationMessages.STRING_EMPTY.replace(
        "ADD:",
        "tattooStyle"
      ),
      "any.required": validationMessages.REQUIRED.replace(
        "ADD:",
        "tattooStyle"
      ),
    }),
});

export default { registrationValidation, addTattooValidation };
