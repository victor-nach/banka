import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

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
   * @param { Object } payload - { id, type, isAdmin }
   * @returns { String } token
   */
  static generateToken(payload) {
    return jwt.sign(payload, process.env.SECRET, { expiresIn: '2w' });
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

  /**
   * @static decodeToken
   * @description decodes the token and returns the corresponding payload
   * @param { String } token
   * @returns { Object } payload - { id, type, isAdmin }
   * @memberof Helper
   */
  static decodeToken(token) {
    return jwt.verify(token, process.env.SECRET);
  }

  /**
   * @static camelCased
   * @param { Object } object
   * @description converts keys in an object from snake_case to camelCase
   * @returns a new object
   * @memberof Helpers
   */
  static camelCased(object) {
    const newObject = {};
    Object.entries(object).forEach((entry) => {
      const newKey = entry[0].replace(/(_\w)/g, match => match[1].toUpperCase());
      newObject[newKey] = entry[1];
    });
    return newObject;
  }
}

export default Helpers;
