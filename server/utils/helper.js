import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

class Helpers {
  /**
   * @static hashPassword
   * @description hashes a password
   * @param { string } password
   * @returns hashed password
   */
  static hashPassword(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8));
  }

  /**
   * @static generateToken
   * @description generates authentication token
   * @param { Object }payload
   * @returns { String } token
   */
  static generateToken(payload) {
    return jwt.sign(payload, 'secret');
  }
}

export default Helpers;
