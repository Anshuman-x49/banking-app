import { Router } from "express";
import {
  refreshTokenValidator,
  userLoginValidatror,
  userLogoutValidator,
  userRegisterValidator,
} from "../validations/auth.validation.js";
import {
  issueRefreshToken,
  refreshTokenController,
  userLoginController,
  userLogoutController,
  userRegisterController,
} from "../controllers/auth.controller.js";
import passport from "../config/passport.js";
import config from "../config/config.js";

const router = Router();

/**
 * @route GET /api/auth/google
 * @desc Google authentication
 * @access Public
 */
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account",
    session: false,
  }),
);

/**
 * @route GET /api/auth/google/callback
 * @desc Google authentication callback
 * @access Public
 */
router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: `${config.client_url}/login?error=google`,
  }),
  async (req, res) => {
    try {
      // Establish the refresh session; the client rebuilds its session from this cookie
      await issueRefreshToken(req.user, res);
      res.redirect(`${config.client_url}/`);
    } catch (error) {
      console.error(error);
      res.redirect(`${config.client_url}/login`);
    }
  },
);

/**
 * @route POST /api/auth/register
 * @desc Register a new user
 * @access Public
 */
router.post("/register", userRegisterValidator, userRegisterController);

/**
 * @route POST /api/auth/login
 * @desc Login a user
 * @access Public
 */
router.post("/login", userLoginValidatror, userLoginController);

/**
 * @route POST /api/auth/refresh-token
 * @desc Refresh access token
 * @access Private
 */
router.post("/refresh-token", refreshTokenValidator, refreshTokenController);

/**
 * @route POST /api/auth/logout
 * @desc Logout a user
 * @access Private
 */
router.post("/logout", userLogoutValidator, userLogoutController);

export default router;
