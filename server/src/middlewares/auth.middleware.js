import { verifyAccessToken } from "../utils/auth.utils.js";

async function authMiddleware(req, res, next) {
  // get token from header
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  try {
    // verify token
    const decoded = verifyAccessToken(token);

    // save decoded user in request
    req.user = decoded;

    next();
  } catch (error) {
    // send error response
    return res.status(401).json({
      message: "Invalid access token",
      error: error.message,
    });
  }
}

export { authMiddleware };
