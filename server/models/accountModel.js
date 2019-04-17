import userDb from './data/userDb';
import accountDb from './data/accountDb';

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
  static createAccount(userId, type, openingBalance) {
    const user = userDb.find(element => element.id === userId);
    const id = accountDb.length + 1;
    const accountNumber = id + 1234567800;
    const newAccount = {
      id,
      accountNumber,
      createdOn: new Date(),
      owner: user.id,
      type,
      status: 'active',
      balance: openingBalance,
    };
    accountDb.push(newAccount);
    return {
      accountNumber,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
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
