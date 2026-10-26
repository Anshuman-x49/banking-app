import { generateAccountNumber } from "../utils/account.utils.js";
import accountModel from "../models/account.model.js";

// Create a new account for the user
const createAccountController = async (req, res) => {
  try {
    const { id } = req.user;

    const account = await accountModel.findOne({ userId: id });

    if (account) {
      return res.status(400).json({
        message: "Account already exists",
      });
    }

    const newAccount = await accountModel.create({
      userId: id,
      accountNumber: generateAccountNumber(),
      currency: "INR",
    });

    return res.status(201).json({
      message: "Account created successfully",
      data: newAccount,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

export { createAccountController };
