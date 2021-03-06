import db from './db';
import queries from './db/queries';
import helper from '../utils/helper';

const {
  getAllAccounts, getSingleAccount, insertAccount, getSingleUser, getAccountByStatus,
  getUserById, updateAccountStatus, deleteSingleAccount, getAccountByOwner,
} = queries;

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
    const accountNumber = helper.genAccNumber(result.rows);
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
  static async editAccount(status, accountNumber) {
    let values = [accountNumber];
    const { rows } = await db.query(getSingleAccount, values);
    if (!rows[0]) {
      const error = new Error();
      error.name = 'account_null';
      throw error;
    }
    values = [status, accountNumber];
    await db.query(updateAccountStatus, values);
    return {
      accountNumber: Number(accountNumber),
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
  static async deleteAccount(accountNumber) {
    let values = [accountNumber];
    const { rows } = await db.query(getSingleAccount, values);
    if (!rows[0]) {
      const error = new Error();
      error.name = 'account_null';
      throw error;
    }
    values = [accountNumber];
    await db.query(deleteSingleAccount, values);
  }

  /**
   * @static allUserAccounts
   * @param { String } email
   * @param { String } userId
   * @param { String } isAdmin
   * @returns accounts array
   * @memberof Account
   */
  static async allUserAccounts(email, userId, isAdmin) {
    let values = [email];
    // query the user table looking for an email match
    const user = await db.query(getSingleUser, values);
    if (!user.rows[0]) {
      const error = new Error();
      error.name = 'email_null';
      throw error;
    }
    values = [user.rows[0].id];
    // check if the user has any accounts
    const { rows } = await db.query(getAccountByOwner, values);
    if (!rows[0]) {
      const error = new Error();
      error.name = 'account_null';
      throw error;
    }
    // if user doesn't own the account
    if (Number(rows[0].owner) !== Number(userId) && isAdmin !== true) {
      const error = new Error();
      error.name = 'unauthorized_access';
      throw error;
    }
    const accounts = rows.map(element => helper.camelCased(element));
    return accounts;
  }

  /**
   * @static allUserAccounts
   * @param { Number } accountNumber
   * @param { String } userId
   * @param { String } isAdmin
   * @returns accounts array
   * @memberof Account
   */
  static async singleBankAccount(accountNumber, userId, isAdmin) {
    const values = [accountNumber];
    const { rows } = await db.query(getSingleAccount, values);
    if (!rows[0]) {
      const error = new Error();
      error.name = 'account_null';
      throw error;
    }
    // if user doesn't own the account
    if (Number(rows[0].owner) !== Number(userId) && isAdmin !== true) {
      const error = new Error();
      error.name = 'unauthorized_access';
      throw error;
    }
    return helper.camelCased(rows[0]);
  }

  static async allBankAccounts(type) {
    let result;
    if (type === 'bank') {
      result = await db.query(getAllAccounts);
    } else {
      const values = [type];
      result = await db.query(getAccountByStatus, values);
    }
    if (!result.rows[0]) {
      const error = new Error();
      error.name = 'account_null';
      throw error;
    }
    const accounts = result.rows.map(element => helper.camelCased(element));
    return accounts;
  }
}

export default Account;
