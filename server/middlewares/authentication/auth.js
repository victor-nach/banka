import helper from '../../utils/helper';
import ResponseMsg from '../../utils/responseMsg';
import db from '../../models/db';
import queries from '../../models/db/queries';

const { responseErr } = ResponseMsg;

class Auth {
  /**
   * @static verifyToken
   * @param { Object } req
   * @param { Object } res
   * @param { Object } next
   * @returns response object with error messages or passes control to the next function
   * @description checks if the token is provided, valid or invalid
   * @memberof Auth
   */
  static async verifyToken(req, res, next) {
    const token = req.headers['x-access-token'];
    if (!token) {
      return responseErr(res, 400, 'invalid request, token missing');
    }
    try {
      const payload = await helper.decodeToken(token);
      req.user = {
        userId: payload.id,
        isAdmin: payload.isAdmin,
        userType: payload.type,
      };
      return next();
    } catch (error) {
      return responseErr(res, 400, 'the token you have provided is invalid');
    }
  }

  /**
   * @static verifyToken
   * @param { Object } req
   * @param { Object } res
   * @param { Object } next
   * @returns response object with error messages or passes control to the next function
   * @description checks if the token is valid for staffs
   * @memberof Auth
   */
  static async verifyStaff(req, res, next) {
    if (req.user.userType !== 'staff') {
      return responseErr(res, 401, `unauthorized access(${req.user.userType}), you need to be a staff`);
    }
    return next();
  }

  /**
   * @static verifyToken
   * @param { Object } req
   * @param { Object } res
   * @param { Object } next
   * @returns response object with error messages or passes control to the next function
   * @description checks if the token is valid for admins
   * @memberof Auth
   */
  static async verifyAdmin(req, res, next) {
    if (req.user.isAdmin !== true) {
      return responseErr(res, 401, `unauthorized access(${req.user.userType}), you need to be an Admin`);
    }
    return next();
  }

  static async verifyTransactionOwner(req, res, next) {
    const { userId, isAdmin, userType } = req.user;
    const { transactionId } = req.params;
    let values = [transactionId];
    const { rows } = await db.query(queries.getSingleTransaction, values);
    if (!rows[0]) {
      return responseErr(res, 404, 'No transaction found for the provided transaction id');
    }
    const transaction = helper.camelCased(rows[0]);
    values = [transaction.accountNumber];
    const result = await db.query(queries.getSingleAccount, values);
    const account = helper.camelCased(result.rows[0]);
    if (Number(account.owner) !== Number(userId) && isAdmin !== true) {
      return responseErr(res, 401, `unauthorized access (${userType}), you need to be an admin to view other user's transactions`);
    }
    return next();
  }

  static async verifyAccountOwner(req, res, next) {
    const { accountNumber } = req.params;
    const { userId, isAdmin, userType } = req.user;
    const values = [accountNumber];
    const result = await db.query(queries.getSingleAccount, values);
    if (!result.rows[0]) {
      return responseErr(res, 404, 'this account number doesn\'t exist');
    }
    if (Number(result.rows[0].owner) !== Number(userId) && isAdmin !== true) {
      return responseErr(res, 401, `unauthorized access (${userType}), you need to be an admin to view other user's transactions`);
    }
    return next();
  }
}

export default Auth;
