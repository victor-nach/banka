import accountDb from './data/accountDb';
import db from './db';
import queries from './db/queries';
import helper from '../utils/helper';

const { getAllAccounts, insertAccount, getUserById } = queries;

class Account {
  /**
   * @static createAccount
   * @description creates a new bank account entry in the database
   * @param { Number }  user id
   * @param { String } type account type
   * @param { String } openingBalance
   * @returns { Object } the created account details
   * @memberof User
   */
  static async createAccount(userId, type, openingBalance) {
    let values = [userId];
    const { rows } = await db.query(getUserById, values);
    const { firstName, lastName, email } = helper.camelCased(rows[0]);
    const result = await db.query(getAllAccounts);
    // get the value of the account number of the account in the array, then add 1
    const accountNumber = Number(result.rows[result.rows.length - 1].account_number) + 1;
    values = [accountNumber, userId, type, 'draft', openingBalance];
    await db.query(insertAccount, values);
    return {
      accountNumber,
      firstName,
      lastName,
      email,
      type,
      openingBalance,
    };
  }

  /**
   * @static editAccount
   * @description activates or deactivates a client's bank account
   * @param { Number }  user id
   * @param { String } status status - active or dormant
   * @param { String } accountNumber
   * @returns { Object } details from the updated account
   * @memberof User
   */
  static editAccount(status, accountNumber) {
    const account = accountDb.find(element => element.accountNumber === Number(accountNumber));
    if (!account) {
      const error = new Error();
      error.name = 'account_null';
      throw error;
    }
    account.status = status;
    return {
      accountNumber: account.accountNumber,
      status,
    };
  }

  /**
   * @static deleteAccount
   * @description deletes a client's bank account
   * @param { Number } accountNumber
   * @returns {}
   * @memberof User
   */
  static deleteAccount(accountNumber) {
    const account = accountDb.find(element => element.accountNumber === Number(accountNumber));
    if (!account) {
      const error = new Error();
      error.name = 'account_null';
      throw error;
    }
    accountDb.splice(account.id - 1, 1);
  }
}

export default Account;
