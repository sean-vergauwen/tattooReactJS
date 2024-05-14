import Joi from "joi";
import JoiDate from "@joi/date";
const JoiExtended = Joi.extend(JoiDate);
import validationMessages from "../Utils/validationMessages";

const loginValidation = Joi.object({
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
});

const idValidation = Joi.object({
  id: Joi.string()
    .required()
    .messages({
      "string.base": validationMessages.STRING_BASE.replace("ADD:", "Id"),
      "string.empty": validationMessages.STRING_EMPTY.replace("ADD:", "Id"),
      "any.required": validationMessages.REQUIRED.replace("ADD:", "Id"),
    }),
});

const commentValidation = Joi.object({
  id: Joi.string()
    .required()
    .messages({
      "string.base": validationMessages.STRING_BASE.replace("ADD:", "Id"),
      "string.empty": validationMessages.STRING_EMPTY.replace("ADD:", "Id"),
      "any.required": validationMessages.REQUIRED.replace("ADD:", "Id"),
    }),
  comment: Joi.string()
    .required()
    .messages({
      "string.base": validationMessages.STRING_BASE.replace("ADD:", "Comment"),
      "string.empty": validationMessages.STRING_EMPTY.replace(
        "ADD:",
        "Comment"
      ),
      "any.required": validationMessages.REQUIRED.replace("ADD:", "Comment"),
    }),
});

const styleValidation = Joi.object({
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

export default {
  loginValidation,
  idValidation,
  commentValidation,
  styleValidation,
};
