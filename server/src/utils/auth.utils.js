import jwt from "jsonwebtoken";
import crypto from "crypto";
import config from "../config/config.js";

// cookie option
const cookieOptions = {
  httpOnly: true,
  // Only send over HTTPS in production; permits HTTP in local development
  secure: config.node_env === "production",
  // 'lax' allows the cookie during top-level cross-site GET redirects (e.g. Google OAuth callbacks) while protecting against CSRF
  sameSite: "lax",
  maxAge: 24 * 60 * 60 * 1000,
};

// generate access token
const generateAccessToken = ({ id }) => {
  return jwt.sign({ id }, config.access_token_secret, {
    expiresIn: "15m",
  });
};

// generate refresh token
const generateRefreshToken = ({ id }) => {
  return jwt.sign({ id }, config.refresh_token_secret, {
    expiresIn: "7d",
  });
};

// verify access token
const verifyAccessToken = ({ accessToken }) => {
  return jwt.verify(accessToken, config.access_token_secret);
};

// verify refresh token
const verifyRefreshToken = ({ refreshToken }) => {
  return jwt.verify(refreshToken, config.refresh_token_secret);
};

/**
 * CSRF Protection for OAuth Flows:
 * Generates a high-entropy, cryptographically random state parameter.
 * This state is stored temporarily (e.g. in Redis or cookie) and sent to Google,
 * then validated upon callback to prevent OAuth login CSRF attacks.
 */
const generateOAuthState = () => {
  return crypto.randomBytes(32).toString("hex");
};

/**
 * Timing-safe state comparison to mitigate timing attacks during CSRF validation.
 */
const verifyOAuthState = (receivedState, storedState) => {
  if (!receivedState || !storedState) return false;
  try {
    const receivedBuffer = Buffer.from(receivedState);
    const storedBuffer = Buffer.from(storedState);
    if (receivedBuffer.length !== storedBuffer.length) return false;
    return crypto.timingSafeEqual(receivedBuffer, storedBuffer);
  } catch {
    return false;
  }
};

export {
  cookieOptions,
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  generateOAuthState,
  verifyOAuthState,
};
