import transactionDb from './data/transactionDb';
import accountDb from './data/accountDb';

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
  static transactions(amount, accountNumber, userId, type) {
    const account = accountDb.find(element => element.accountNumber === Number(accountNumber));
    if (!account) {
      const error = new Error();
      error.name = 'account_null';
      throw error;
    }
    if (Number(amount) >= Number(account.balance)) {
      const error = new Error();
      error.name = 'insufficient_funds';
      throw error;
    }
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
    const oldBalance = account.balance;
    let newBalance = type === 'debit' ? Number(oldBalance) - Number(amount) : Number(oldBalance) + Number(amount);
    newBalance = parseFloat(newBalance).toFixed(2);
    console.log(account);
    account.balance = Number(newBalance);
    console.log(account);
    const transaction = {
      id: transactionDb.length + 1,
      createdOn: new Date(),
      type,
      accountNumber: Number(accountNumber),
      cashier: userId,
      amount,
      oldBalance,
      newBalance,
    };
    transactionDb.push(transaction);
    return transaction;
  }
}

export default Account;
