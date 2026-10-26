import jwt from "jsonwebtoken";
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

export {
  cookieOptions,
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
};
