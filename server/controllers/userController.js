import userModel from '../models/userModel';
import helper from '../utils/helper';
import ResponseMsg from '../utils/responseMsg';
import Notifications from '../utils/notifications';

const { response, responseErr, responseShort } = ResponseMsg;

class UserController {
  static async signup(req, res) {
    const {
      firstName, lastName, email, password, isAdmin, type,
    } = req.body;
    const hashedPassword = helper.hashPassword(password);
    try {
      const user = await userModel
        .signup(firstName, lastName, email, hashedPassword, type, isAdmin);
      const token = await helper.generateToken({
        id: user.id,
        type: user.type,
        isAdmin: user.isAdmin,
      });
      return response(res, 201, {
        token, id: user.id, firstName, lastName, email,
      });
    } catch (error) {
      if (error.constraint === 'users_email_key') {
        return responseErr(res, 409, 'Kindly use another email, this email address has already been used');
      }
      return responseErr(res, 500, 'Internal server error');
    }
  }

  static async signin(req, res) {
    const { email, password } = req.body;
    try {
      const {
        id, firstName, lastName, hashedPassword, type, isAdmin,
      } = await userModel.signin(email);
      const token = await helper.generateToken({ id, type, isAdmin });
      if (helper.comparePassword(password, hashedPassword) === true) {
        return response(res, 200, {
          token, firstName, lastName, email,
        });
      }
      return responseErr(res, 403, 'the password you have entered is invalid');
    } catch (error) {
      if (error.name === 'email_null') {
        return responseErr(res, 404, 'this email has been not been registered on this platform');
      }
      return responseErr(res, 500, 'Internal server error');
    }
  }

  /**
   * @static
   * @param { Object} req
   * @param { Object } res
   * @description sends a password reset link and handles the post request
   * that receives the user's email
   * @returns response object
   * @memberof UserController
   */
  static async resetPassword(req, res) {
    const { email } = req.body;
    try {
      const user = await userModel.resetPassword(email);
      const token = helper.generateToken({ userId: user.id }, user.hashedPassword);
      const link = `<a href='https://victor-banka.herokuapp.com/api/v1/auth/password-reset/${user.id}/${token}'>reset link<a/>`;
      await Notifications.sendResetLink(link, user);
      return response(res, 200, {
        token,
        id: user.id,
        message: `the password reset link has been successfully sent to your email address at ${user.email}`,
      });
    } catch (error) {
      if (error.name === 'email_null') {
        return responseErr(res, 404, 'this email does not exist on this platform');
      }
      return responseErr(res, 500, 'Internal server error');
    }
  }

  /**
   * @static new Password
   * @param { Object} req
   * @param { Object } res
   * @description sends a password reset link and handles the post request
   * that receives the user's email
   * @returns response object
   * @memberof UserController
   */
  static async newPassword(req, res) {
    try {
      const { password } = req.body;
      const { token, id } = req.params;
      await userModel.updatePassword(id, token, password);
      return responseShort(res, 200, 'your password has been successfully upated');
    } catch (error) {
      if (error.name === 'user_null') {
        return responseErr(res, 404, 'invalid user id');
      }
      if (error.name === 'JsonWebTokenError') {
        return responseErr(res, 401, 'One time token you have provided is invalid');
      }
      return responseErr(res, 500, 'Internal server error');
    }
  }
}

export default UserController;
