import TransactionModel from '../models/transactionModel';
import ResponseMsg from '../utils/responseMsg';

const { response, responseErr } = ResponseMsg;

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
      const transaction = await TransactionModel
        .transactions(amount, accountNumber, userId, transactionType);
      const { newBalance, id } = transaction;
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
   * @static debit account
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
      const transaction = await TransactionModel
        .transactions(amount, accountNumber, userId, transactionType);
      const { newBalance, id } = transaction;
      return response(res, 200, {
        transactionId: id,
        accountNumber: Number(accountNumber),
        amount,
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
}

export default TransactionController;
