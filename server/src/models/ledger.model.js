import mongoose from "mongoose";

const ledgerSchema = new mongoose.Schema({
  account: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "account",
    required: [true, "Account is required"],
    index: true,
    immutable: true,
  },
  transactions: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "transaction",
    required: [true, "Transaction is required"],
    index: true,
    immutable: true,
  },
  amount: {
    type: Number,
    required: [true, "Amount is required"],
    immutable: true,
  },
  type: {
    type: String,
    enum: {
      values: ["CREDIT", "DEBIT"],
      message: "Type should be CREDIT or DEBIT",
    },
    required: [true, "Type is required"],
  },
});

function preventUpdate() {
  throw new Error(
    "Ledger entries are immutable and cannot be modified or deleted",
  );
}

ledgerSchema.pre(
  [
    "save",
    "replace",
    "findOneAndReplace",
    "updateMany",
    "updateOne",
    "findOneAndUpdate",
    "deleteMany",
    "deleteOne",
    "findOneAndDelete",
  ],
  preventUpdate,
);

const ledgerModel = mongoose.model("ledger", ledgerSchema);

export default ledgerModel;
