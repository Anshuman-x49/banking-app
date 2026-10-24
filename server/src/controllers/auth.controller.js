import userModel from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import {
  cookieOptions,
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/auth.utils.js";
import redis from "../config/redis.js";
import { sendRegistrationEmail } from "../services/email.service.js";

// Issue a refresh token: hash it, persist the hash on the user, and set the HTTP-only cookie
const issueRefreshToken = async (user, res) => {
  const refreshToken = generateRefreshToken({ id: user._id });

  const salt = await bcryptjs.genSalt(10);
  const refreshTokenHash = await bcryptjs.hash(refreshToken, salt);

  await userModel.findByIdAndUpdate(user._id, { refreshTokenHash });
  res.cookie("refreshToken", refreshToken, cookieOptions);
};

// Token Consistency Helper
const sendAuthTokenResponse = async (
  user,
  res,
  statusCode = 200,
  message = "Authentication successful",
) => {
  // 1. Generate access token and issue the refresh session
  const accessToken = generateAccessToken({ id: user._id });
  await issueRefreshToken(user, res);

  // 2. Return consistent JSON response
  return res.status(statusCode).json({
    message,
    data: {
      accessToken,
      user: {
        name: user.name,
        email: user.email,
        id: user._id,
        avatar: user.avatar,
        authProvider: user.authProvider,
      },
    },
  });
};

// user registration controller
const userRegisterController = async (req, res) => {
  // Extract data from request body
  const { name, email, password } = req.body;
  const lockKey = `lock:register:${email}`;
  let lockAcquired = false;

  try {
    // Acquire lock with 10 second expiration time
    const acquired = await redis.set(lockKey, "1", "EX", 10, "NX");

    // if lock is not acquired, return error
    if (!acquired) {
      return res.status(429).json({
        message: "Registration in progress, please try again later",
        error: "Too many requests",
      });
    }

    // set lock acquired flag
    lockAcquired = true;

    // Check if user already exists
    const isUserExists = await userModel.findOne({ email });

    if (isUserExists) {
      return res.status(409).json({
        message: "User already exists",
        errors: [
          {
            path: "email",
            msg: "Email already exists",
          },
        ],
      });
    }

    // hashing password
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    // Create new user
    const user = await userModel.create({
      name,
      email,
      password: hashedPassword,
    });

    // Consistent token issuance and cookie setup
    await sendAuthTokenResponse(
      user,
      res,
      201,
      "User registered successfully",
    );

    // send email to user
    sendRegistrationEmail({ to: user.email, name: user.name }).catch((error) => {
      console.error(error);
    });
  } catch (error) {
    // for internal server error
    return res.status(500).json({
      message: "Error while registering user",
      error: error.message,
    });
  } finally {
    // release lock if acquired
    if (lockAcquired) {
      await redis.del(lockKey);
    }
  }
};

// user login controller
const userLoginController = async (req, res) => {
  // Extract data from request body
  const { email, password } = req.body;
  const attemptsKey = `login:attempts:${email}`;
  const lockKey = `lock:login:${email}`;

  try {
    // Check if user is locked
    const isLocked = await redis.get(lockKey);

    if (isLocked) {
      const ttl = await redis.ttl(lockKey);
      return res.status(429).json({
        message: "Too many requests",
        error: `Too many requests, please try again in ${Math.ceil(ttl / 60)} minutes`,
      });
    }

    // Check if user exists
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        errors: [
          {
            path: "email",
            msg: "Email not found",
          },
        ],
      });
    }

    // compare password
    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      // Increment failed attempts
      const attempt = await redis.incr(attemptsKey);

      // Set expiry for 15 minutes on first failed attempt
      if (attempt === 1) {
        await redis.expire(attemptsKey, 15 * 60);
      }

      return res.status(401).json({
        message: "Invalid email or password",
        errors: [
          {
            path: "password",
            msg: `Invalid email or password. ${5 - attempt} attempts remaining`,
          },
        ],
      });
    }

    // Successfull login -> Clear all failed attempts and lock
    await redis.del(attemptsKey);
    await redis.del(lockKey);

    // Issue consistent tokens and set refresh cookie
    return await sendAuthTokenResponse(
      user,
      res,
      200,
      "User logged in successfully",
    );
  } catch (error) {
    // for internal server error
    return res.status(500).json({
      message: "Error while logging in user",
      error: error.message,
    });
  }
};

// user refresh token controller
const refreshTokenController = async (req, res) => {
  // get refresh token from cookie
  const { refreshToken } = req.cookies;

  try {
    // verify refresh token
    const { id } = verifyRefreshToken({ refreshToken });

    // check if user exists
    const user = await userModel.findById(id);

    // check if refresh token hash exists and match
    if (!user || !user.refreshTokenHash) {
      return res.status(401).json({
        message: "Invalid refresh token",
        errors: [
          {
            path: "refreshToken",
            msg: "Invalid refresh token",
          },
        ],
      });
    }

    // compare refresh token
    const isRefreshTokenValid = await bcryptjs.compare(
      refreshToken,
      user.refreshTokenHash,
    );

    // if refresh token is invalid
    if (!isRefreshTokenValid) {
      // remove refresh token from user
      await userModel.findByIdAndUpdate(user._id, { refreshTokenHash: null });
      // remove refresh token from cookie
      res.clearCookie("refreshToken", cookieOptions);
      return res.status(401).json({
        message: "Invalid refresh token",
        errors: [
          {
            path: "refreshToken",
            msg: "Invalid refresh token",
          },
        ],
      });
    }

    // generate new tokens
    const accessToken = generateAccessToken({ id: user._id });
    const newRefreshToken = generateRefreshToken({ id: user._id });

    // hashing new refresh token
    const salt = await bcryptjs.genSalt(10);
    const refreshTokenHash = await bcryptjs.hash(newRefreshToken, salt);

    // update user with new refresh token hash
    await userModel.findByIdAndUpdate(user._id, { refreshTokenHash });

    // set new refresh token in cookie
    res.cookie("refreshToken", newRefreshToken, cookieOptions);

    // response to client
    return res.status(200).json({
      message: "Refresh token generated successfully",
      data: {
        accessToken,
        user: {
          name: user.name,
          email: user.email,
          id: user._id,
        },
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error while refreshing token",
      error: error.message,
    });
  }
};

// user logout controller
const userLogoutController = async (req, res) => {
  // get refresh token from cookie
  const { refreshToken } = req.cookies;

  try {
    // verify refresh token
    const { id } = verifyRefreshToken({ refreshToken });

    // check if user exists
    const user = await userModel.findById(id);

    // check if refresh token hash exists and match
    if (!user || !user.refreshTokenHash) {
      return res.status(401).json({
        message: "Invalid refresh token",
        errors: [
          {
            path: "refreshToken",
            msg: "Invalid refresh token",
          },
        ],
      });
    }

    // compare refresh token
    const isRefreshTokenValid = await bcryptjs.compare(
      refreshToken,
      user.refreshTokenHash,
    );

    // if refresh token is invalid
    if (!isRefreshTokenValid) {
      // remove refresh token from user
      await userModel.findByIdAndUpdate(user._id, { refreshTokenHash: null });
      // remove refresh token from cookie
      res.clearCookie("refreshToken", cookieOptions);
      return res.status(401).json({
        message: "Invalid refresh token",
        errors: [
          {
            path: "refreshToken",
            msg: "Invalid refresh token",
          },
        ],
      });
    }

    // remove refresh token from user
    await userModel.findByIdAndUpdate(user._id, { refreshTokenHash: null });
    // remove refresh token from cookie
    res.clearCookie("refreshToken", cookieOptions);
    // response to client
    return res.status(200).json({
      message: "User logged out successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error while logging out user",
      error: error.message,
    });
  }
};

export {
  issueRefreshToken,
  userRegisterController,
  userLoginController,
  refreshTokenController,
  userLogoutController,
};
