import db from './db';
import queries from './db/queries';
import helper from '../utils/helper';

const {
  getSingleAccount, updateAccountBalance, getSingleTransaction,
  insertTransaction, getAllTransactions,
} = queries;

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
    values = [type, accountNumber, userId, Number(amount), oldBalance, newBalance];
    const result = await db.query(insertTransaction, values);
    return helper.camelCased(result.rows[0]);
  }

  /**
   * @static allTransactions
   * @param { number } userId
   * @param { number } accountNumber
   * @param { boolean } isAdmin
   * @returns array of all transaction objects
   * @description queries the database to get all transactions for a given account number
   * @memberof Account
   */
  static async allTransactions(userId, accountNumber, isAdmin) {
    const values = [accountNumber];
    const result = await db.query(getSingleAccount, values);
    if (!result.rows[0]) {
      const error = new Error();
      error.name = 'account_null';
      throw error;
    }
    if (Number(result.rows[0].owner) !== Number(userId) && isAdmin !== true) {
      const error = new Error();
      error.name = 'unauthorized_access';
      throw error;
    }
    if (result.rows[0].status === 'draft') {
      const error = new Error();
      error.name = 'account_draft';
      throw error;
    }
    const { rows } = await db.query(getAllTransactions, values);
    const transactions = rows.map(element => helper.camelCased(element));
    return transactions;
  }

  /**
   * @static singleTransactions
   * @param { number } transactionId
   * @param { number } userId
   * @param { boolean } isAdmin
   * @returns a single transaction object
   * @description queries the database to get a single transactions for a given transaction id
   * @memberof Account
   */
  static async singleTransactions(transactionId, userId, isAdmin) {
    let values = [transactionId];
    const { rows } = await db.query(getSingleTransaction, values);
    if (!rows[0]) {
      const error = new Error();
      error.name = 'trans_null';
      throw error;
    }
    const transaction = helper.camelCased(rows[0]);
    values = [transaction.accountNumber];
    const result = await db.query(getSingleAccount, values);
    const account = helper.camelCased(result.rows[0]);
    if (Number(account.owner) !== Number(userId) && isAdmin !== true) {
      const error = new Error();
      error.name = 'unauthorized_access';
      throw error;
    }
    return transaction;
  }
}

export default Account;
