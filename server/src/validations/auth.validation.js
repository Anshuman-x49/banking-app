import { body, cookie, validationResult } from "express-validator";

// user register validator
const userRegisterValidator = [
  body("name")
    .exists()
    .withMessage("name is required")
    .bail()
    .trim()
    .isLength({ min: 3 })
    .withMessage("name must be at least 3 characters long"),

  body("email")
    .exists()
    .withMessage("email is required")
    .bail()
    .trim()
    .isEmail()
    .withMessage("email is invalid"),

  body("password")
    .exists()
    .withMessage("password is required")
    .bail()
    .trim()
    .isLength({ min: 6 })
    .withMessage("password must be at least 6 characters long"),

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

// user login validator
const userLoginValidatror = [
  body("email")
    .exists()
    .withMessage("email is required")
    .bail()
    .trim()
    .isEmail()
    .withMessage("email is invalid"),

  body("password")
    .exists()
    .withMessage("password is required")
    .bail()
    .trim()
    .isLength({ min: 6 })
    .withMessage("password must be at least 6 characters long"),

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

// refresh token validator
const refreshTokenValidator = [
  cookie("refreshToken")
    .exists()
    .withMessage("refresh token is required")
    .bail()
    .trim()
    .isJWT()
    .withMessage("refresh token is invalid"),

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

// user logout validator
const userLogoutValidator = [
  cookie("refreshToken")
    .exists()
    .withMessage("refresh token is required")
    .bail()
    .trim()
    .isJWT()
    .withMessage("refresh token is invalid"),

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

export {
  userRegisterValidator,
  userLoginValidatror,
  refreshTokenValidator,
  userLogoutValidator,
};
