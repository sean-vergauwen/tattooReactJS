interface ValidationMessages {
  [key: string]: string;
}

const validationMessages: ValidationMessages = {
  REQUIRED: "ADD: is required.",
  EMPTY: "ADD: can't be empty",
  EMAIL: "ADD: must be a valid email address.",
  MIN_LENGTH: "ADD: must be at least {#limit} characters long.",
  STRING_BASE: "ADD: must be a string.",
  STRING_EMPTY: "ADD: can't be empty.",
  STRING_MIN: "ADD: must be at least {#limit} characters.",
  STRING_MAX: "ADD: cannot exceed {#limit} characters.",
  STRING_ALPHANUM: "ADD: must only contain alphanumeric characters.",
  STRING_REGEX: "ADD: does not match the required pattern.",
  STRING_VALID: "Invalid option for {#label}. Valid options are: {#valids}.",
  STRING_LENGTH: "ADD: must be exactly {#limit} digits",
  NUMBER_BASE: "ADD: must be a number.",
  NUMBER_MIN: "ADD: must be at least {#limit}.",
  NUMBER_MAX: "ADD: cannot exceed {#limit}.",
  NUMBER_INTEGER: "ADD: must be an integer.",
  NUMBER_POSITIVE: "ADD: must be a positive number.",
  NUMBER_EMPTY: "ADD: can't be empty",
  NUMBER_NEGATIVE: "ADD: must be a negative number.",
  ARRAY_BASE: "ADD: must be an array.",
  ARRAY_MIN: "ADD: must contain at least {#limit} items.",
  ARRAY_MAX: "ADD: cannot contain more than {#limit} items.",
  ARRAY_LENGTH: "ADD: must contain exactly {#limit} items.",
  OBJECT_BASE: "ADD: must be an object.",
  DATE_BASE: "ADD: must be a valid date format {#format}",
  DATE_FORMAT: "ADD: must be in the format {#format}.",
  ANY_ONLY: "The ADD: should be either true or false.",
  BOOLEAN_BASE: "The ADD: should be a boolean value.",
};

export default validationMessages;
