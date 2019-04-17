import userModel from '../models/userModel';
import helper from '../utils/helper';
import ResponseMsg from '../utils/responseMsg';

const { response, responseErr } = ResponseMsg;

class UserController {
  static async signup(req, res) {
    const {
      firstName, lastName, email, password,
    } = req.body;
    const hashedPassword = helper.hashPassword(password);
    try {
      const user = await userModel.signup(firstName, lastName, email, hashedPassword);
      const { id, type, isAdmin } = user;
      const token = await helper.generateToken({ id, type, isAdmin });
      return response(res, 201, {
        token, id: user.id, firstName, lastName, email,
      });
    } catch (error) {
      if (error.name === 'email_conflict') {
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
}

export default UserController;
