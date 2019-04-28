import TransactionModel from '../models/transactionModel';
import ResponseMsg from '../utils/responseMsg';
import Notifications from '../utils/notifications';

const { response, responseErr, responseShort } = ResponseMsg;

class TransactionController {
  /**
   * @static debit account
   * @param { Object } req
   * @param { Object } res
   * @returns response object
   * @description handles request for debiting of a bank account by a cashier
   * @memberof TransactionController
   */
  static async debitAccount(req, res) {
    const { amount } = req.body;
    const { accountNumber } = req.params;
    const { userId } = req.user;
    const transactionType = 'debit';
    try {
      const { transaction, user } = await TransactionModel
        .transactions(amount, accountNumber, userId, transactionType);
      const { newBalance, id } = transaction;

      await Notifications.sendTransaction(transaction, user);

      return response(res, 200, {
        transactionId: id,
        accountNumber: Number(accountNumber),
        amount,
        cashier: userId,
        transactionType,
        accountBalance: newBalance,
      });
    } catch (error) {
      if (error.name === 'insufficient_funds') {
        return responseErr(res, 400, 'Insufficient funds');
      }
      if (error.name === 'account_null') {
        return responseErr(res, 404, 'this account number doesn\'t exist');
      }
      if (error.name === 'account_draft') {
        return responseErr(res, 400, 'Transaction failed, this account is not yet active (draft)');
      }
      if (error.name === 'account_dormant') {
        return responseErr(res, 400, 'Transaction failed, this account is dormant');
      }
      return responseErr(res, 500, 'Internal server error');
    }
  }

  /**
   * @static credit account
   * @param { Object } req
   * @param { Object } res
   * @returns response object
   * @description handles request for crediting of a bank account by a cashier
   * @memberof TransactionController
   */
  static async creditAccount(req, res) {
    const { amount } = req.body;
    const { accountNumber } = req.params;
    const { userId } = req.user;
    const transactionType = 'credit';
    try {
      const { transaction, user } = await TransactionModel
        .transactions(Number(amount), accountNumber, userId, transactionType);

      await Notifications.sendTransaction(transaction, user);

      const { newBalance, id } = transaction;
      return response(res, 200, {
        transactionId: id,
        accountNumber: Number(accountNumber),
        amount: Number(amount),
        cashier: userId,
        transactionType,
        accountBalance: newBalance,
      });
    } catch (error) {
      if (error.name === 'account_null') {
        return responseErr(res, 404, 'this account number doesn\'t exist');
      }
      if (error.name === 'account_draft') {
        return responseErr(res, 400, 'Transaction failed, this account is not yet active (draft)');
      }
      if (error.name === 'account_dormant') {
        return responseErr(res, 400, 'Transaction failed, this account is dormant');
      }
      return responseErr(res, 500, 'Internal server error');
    }
  }

  /**
   * @static getTransactions
   * @param { Object } req
   * @param { Object } res
   * @returns response object
   * @description handles request for getting all transactions for a given account number
   * @memberof TransactionController
   */
  static async getTransactions(req, res) {
    const { accountNumber } = req.params;
    try {
      const transaction = await TransactionModel.allTransactions(accountNumber);
      return response(res, 200, transaction);
    } catch (error) {
      if (error.name === 'account_draft') {
        return responseErr(res, 400, 'No transactions. This account is not yet active (draft)');
      }
      if (error.name === 'transaction_null') {
        return responseShort(res, 200, 'No transactions yet for this account');
      }
      return responseErr(res, 500, 'Internal server error');
    }
  }

  /**
   * @static getSingleTransaction
   * @param { Object } req
   * @param { Object } res
   * @returns response object
   * @description handles request for getting a single transactions for a given transaction id
   * @memberof TransactionController
   */
  static async getSingleTransaction(req, res) {
    const { transactionId } = req.params;
    try {
      const transaction = await TransactionModel.singleTransactions(transactionId);
      return response(res, 200, transaction);
    } catch (error) {
      return responseErr(res, 500, 'Internal server error');
    }
  }
}

export default TransactionController;
