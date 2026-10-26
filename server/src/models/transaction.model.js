import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    fromAccount: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "account",
      required: [true, "Transaction must be associated with a from account"],
      index: true,
    },
    toAccount: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "account",
      required: [true, "Transaction must be associated with a to account"],
      index: true,
    },
    amount: {
      type: Number,
      required: [true, "Transaction amount is required"],
      min: [1, "Transaction amount must be at least 1"],
    },
    status: {
      type: String,
      enum: {
        values: ["COMPLETED", "PENDING", "FAILED", "REVERSED"],
        message: "Status can either be COMPLETED, PENDING, FAILED or REVERSED",
      },
      default: "PENDING",
    },
    idempotencyKey: {
      type: String,
      required: [
        true,
        "Idempotency key is required for creating a transaction",
      ],
      unique: true,
      index: true,
    },
  },
  { timestamps: true },
);

const transactionModel = mongoose.model("transaction", transactionSchema);

export default transactionModel;
