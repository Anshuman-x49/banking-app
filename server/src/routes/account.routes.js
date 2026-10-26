import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { createAccountController } from "../controllers/account.controller.js";

const router = Router();

/**
 * @route POST /api/account/create
 * @desc Create account for user
 * @access Private
 */
router.post("/create", authMiddleware, createAccountController);

export default router;
