import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { transferValidator } from "../validations/transaction.validation.js";
import { createTransaction } from "../controllers/transaction.controller.js";

const router = Router();

/**
 * @route POST /api/transactions/transfer
 * @desc Transfer money from one account to another
 * @access Private
 */
router.post("/transfer", authMiddleware, transferValidator, createTransaction);

// router.post("/system/initial-funds", authMiddleware, createInitialFunds)

export default router;
