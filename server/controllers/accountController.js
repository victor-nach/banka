import AccountModel from '../models/accountModel';
import ResponseMsg from '../utils/responseMsg';

const { response, responseErr, responseShort } = ResponseMsg;

class AccountController {
  /**
   * @static createAccount
   * @param { Object } req
   * @param { Object } res
   * @returns response object
   * @description handles requests for creation of a new bank account
   * @memberof AccountController
   */
  static async createAccount(req, res) {
    const { type, openingBalance } = req.body;
    const openingBalanceF = parseFloat(openingBalance).toFixed(2);
    const { userId } = req.user;
    try {
      const account = await AccountModel.createAccount(userId, type, openingBalanceF);
      return response(res, 200, account);
    } catch (error) {
      return responseErr(res, 500, 'server error');
    }
  }

  /**
   * @static editAccount
   * @param { Object } req
   * @param { Object } res
   * @returns response object
   * @description handles requests for activating or deactivating a bank account
   * @memberof AccountController
   */
  static async editAccount(req, res) {
    const { status } = req.body;
    const { accountNumber } = req.params;

    try {
      const account = await AccountModel.editAccount(status, accountNumber);
      return response(res, 200, account);
    } catch (error) {
      if (error.name === 'account_null') {
        return responseErr(res, 404, 'Invalid account number, no matches found');
      }
      return responseErr(res, 500, 'Internal server error');
    }
  }

  /**
   * @static deleteAccount
   * @param { Object } req
   * @param { Object } res
   * @returns response object
   * @description handles requests for deleting a bank account
   * @memberof AccountController
   */
  static async deleteAccount(req, res) {
    const { accountNumber } = req.params;
    try {
      await AccountModel.deleteAccount(accountNumber);
      return responseShort(res, 200, 'Account successfuly deleted');
    } catch (error) {
      if (error.name === 'account_null') {
        return responseErr(res, 404, 'Invalid account number, no matches found');
      }
      return responseErr(res, 500, 'Internal server error');
    }
  }

  static async getAllUserAccounts(req, res) {
    const { userId, isAdmin, userType } = req.user;
    const { email } = req.params;
    try {
      const accounts = await AccountModel.allUserAccounts(email, userId, isAdmin);
      return response(res, 200, accounts);
    } catch (error) {
      if (error.name === 'email_null') {
        return responseErr(res, 404, 'no users found for this email address');
      }
      if (error.name === 'unauthorized_access') {
        return responseErr(res, 401, `unauthorized access (${userType}), you need to be an admin to view other user's accounts`);
      }
      if (error.name === 'account_null') {
        return responseShort(res, 200, 'The user doesn\'t have any accounts');
      }
      return responseErr(res, 500, 'Internal Server Error');
    }
  }
}

export default AccountController;
