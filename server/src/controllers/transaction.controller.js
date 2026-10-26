import accountModel from "../models/account.model.js";
import transactionModel from "../models/transaction.model.js";
import ledgerModel from "../models/ledger.model.js";
import { findUserAccount } from "../utils/account.utils.js";

/**
 * steps for one transaction
 * 1. validate the request
 * 2. validate idempotency key
 * 3. check account status
 * 4. derive sender balance from legder
 * 5. create transaction (PENDING)
 * 6. create debit and credit ledgers entries
 * 7. mark transaction COMPLETED
 * 8. commit MongoDB session
 * 9. send response to client
 * 10. send email notification (async)
 */
const createTransaction = async (req, res) => {
  try {
    // 1. validate the request
    const { fromAccount, toAccount, amount, idempotencyKey } = req.body;

    // find the accounts
    const fromUserAccount = await findUserAccount({ id: fromAccount });
    const toUserAccount = await findUserAccount({ id: toAccount });

    if (!fromUserAccount || !toUserAccount) {
      return res.status(404).json({
        message: "Account not found",
      });
    }

    // 2. validate idempotency key
    const isTransactionExist = await transactionModel.findOne({
      idempotencyKey: idempotencyKey,
    });
    if (isTransactionExist) {
      if (isTransactionExist.status === "COMPLETED") {
        return res.status(200).json({
          message: "Transaction already completed",
          transaction: isTransactionExist,
        });
      }
      if (isTransactionExist.status === "PENDING") {
        return res.status(200).json({
          message: "Transaction is still processing",
        });
      }
      if (isTransactionExist.status === "FAILED") {
        return res.status(500).json({
          message: "Transaction has already failed, please retry",
        });
      }
      if (isTransactionExist.status === "REVERSED") {
        return res.status(500).json({
          message:
            "Transaction has already been reversed, please contact support",
        });
      }
    }

    // 3. check account status
    if (
      fromUserAccount.status !== "ACTIVE" ||
      toUserAccount.status !== "ACTIVE"
    ) {
      return res.status(400).json({
        message: "Both accounts must be active to process transaction",
      });
    }

    // 4. derive sender balance from ledger
    const balance = await fromAccount.getBalance();

    // check if the sender account has sufficient balance
    if (balance < amount) {
      return res.status(400).json({
        message: "Insufficient balance",
      });
    }

    // 5. create transaction (PENDING)
    const session = await mongoose.startSession(); //* start the session
    session.startTransaction(); //* start the transaction

    const transaction = await transactionModel.create(
      {
        fromAccount: fromUserAccount._id,
        toAccount: toUserAccount._id,
        amount: amount,
        idempotencyKey: idempotencyKey,
        status: "PENDING",
      },
      { session },
    );

    // 6. create debit and credit ledgers entries
    const debitLedgerAccount = await ledgerModel.create(
      {
        account: fromUserAccount._id,
        transaction: transaction._id,
        amount: amount,
        type: "DEBIT",
      },
      { session },
    );

    const creditLedgerAccount = await ledgerModel.create(
      {
        account: toUserAccount._id,
        transaction: transaction._id,
        amount: amount,
        type: "CREDIT",
      },
      { session },
    );

    // 7. mark transaction COMPLETED
    transaction.status = "COMPLETED";
    await transaction.save({ session });

    await session.commitTransaction(); //* commit the transaction
    session.endSession(); //* end the session

    // 8. send response to client
    res.status(200).json({
      message: "Transaction created successfully",
      transaction: transaction,
    });

    // // 9. send email notification (async)
    // sendEmailNotification({
    //   to: toUserAccount.user.email,
    //   subject: "Transaction notification",
    //   message: `Transaction created successfully`,
    // });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to create transaction",
      error: error.message,
    });
  }
};

// const createInitialFunds = async (req, res) => {
//   try {

//   } catch (error) {}
// }

export { createTransaction };
