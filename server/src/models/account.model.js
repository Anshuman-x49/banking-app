import mongoose from "mongoose";
import ledgerModel from "./ledger.model";

const accountSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: [true, "User is required"],
      index: true,
    },
    accountNumber: {
      type: String,
      required: [true, "Account number is required"],
      unique: true,
    },
    status: {
      type: String,
      enum: {
        values: ["ACTIVE", "FROZEN", "CLOSED"],
        message: "{VALUE} is not a valid status",
      },
      default: "ACTIVE",
    },
    currency: {
      type: String,
      enum: {
        values: ["INR", "PKR", "USD", "EUR", "GBP"],
        message: "{VALUE} is not a valid currency",
      },
      required: [true, "Currency is required"],
      default: "INR",
    },
  },
  {
    timestamps: true,
  },
);

accountSchema.index({ userId: 1, status: 1 });

// get balance using aggregation pipeline
accountSchema.methods.getBalance = async function () {
  // check if the account has an id
  if (!this._id) {
    throw new Error("Account ID is required to get balance");
  }

  // calculate balance from ledger
  const balanceData = await ledgerModel.aggregate([
    {
      $match: {
        accountId: this._id,
      },
    },
    {
      $group: {
        _id: null,
        totalDebit: {
          $sum: {
            $cond: [{ $eq: ["$type", "DEBIT"] }, "$amount", 0],
          },
        },
        totalCredit: {
          $sum: {
            $cond: [{ $eq: ["$type", "CREDIT"] }, "$amount", 0],
          },
        },
      },
    },
    {
      $project: {
        _id: 0,
        balance: {
          $subtract: ["$totalCredit", "$totalDebit"],
        },
      },
    },
  ]);

  return balanceData.length === 0 ? 0 : balanceData[0].balance;
};

const accountModel = mongoose.model("account", accountSchema);

export default accountModel;
