import db from './db';
import queries from './db/queries';
import helper from '../utils/helper';

const { getSingleAccount, updateAccountBalance, insertTransaction } = queries;

class Account {
  /**
   * @static debitAccount
   * @description debits an account with the specified amount
   * @param { Number } amount
   * @param { Number } accountNumber
   * @param { Number } userId the id of the cashier accessing the route
   * @param { String } type either credit or debit
   * @returns { Object } the response object to be returned by controller
   * @memberof User
   */
  static async transactions(amount, accountNumber, userId, type) {
    let values = [accountNumber];
    const { rows } = await db.query(getSingleAccount, values);
    if (!rows[0]) {
      const error = new Error();
      error.name = 'account_null';
      throw error;
    }
    const account = helper.camelCased(rows[0]);
    if (account.status === 'draft') {
      const error = new Error();
      error.name = 'account_draft';
      throw error;
    }
    if (account.status === 'dormant') {
      const error = new Error();
      error.name = 'account_dormant';
      throw error;
    }
    if (type === 'debit' && Number(amount) >= Number(account.balance)) {
      const error = new Error();
      error.name = 'insufficient_funds';
      throw error;
    }
    const oldBalance = account.balance;
    const newBalance = type === 'debit' ? Number(oldBalance) - Number(amount) : Number(oldBalance) + Number(amount);
    values = [newBalance, accountNumber];
    await db.query(updateAccountBalance, values);
    values = [type, accountNumber, userId, oldBalance, newBalance];
    const result = await db.query(insertTransaction, values);
    return helper.camelCased(result.rows[0]);
  }
}

export default Account;
