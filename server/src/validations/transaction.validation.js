import { body, validationResult } from "express-validator";

const transferValidator = [
  body("fromAccount")
    .exists()
    .withMessage("From account is required")
    .bail()
    .isMongoId()
    .withMessage("Invalid from account ID"),
  body("toAccount")
    .exists()
    .withMessage("To account is required")
    .bail()
    .isMongoId()
    .withMessage("Invalid to account ID"),
  body("amount")
    .exists()
    .withMessage("Amount is required")
    .bail()
    .isNumeric()
    .withMessage("Amount must be a number")
    .custom((value) => {
      const numericValue = parseFloat(value);
      if (isNaN(numericValue) || numericValue <= 0) {
        throw new Error("Amount must be a positive number");
      }
      return true;
    }),
  body("idempotencyKey")
    .exists()
    .withMessage("Idempotency key is required")
    .bail()
    .isUUID()
    .withMessage("Invalid idempotency key"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }
    next();
  },
];

export { transferValidator };
