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

  /**
   * @static comparePassword
   * @description compares two passwords
   * @param { String } password
   * @param { String } hashedPassword
   * @returns { Boolean } True or false
   */
  static comparePassword(password, hashedPassword) {
    return bcrypt.compareSync(password, hashedPassword);
  }
}

export default Helpers;
