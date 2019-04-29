import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

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
  static generateToken(payload, secret) {
    return jwt.sign(payload, secret || process.env.SECRET, { expiresIn: '2w' });
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
  static decodeToken(token, secret) {
    return jwt.verify(token, secret || process.env.SECRET);
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

  /**
   * @static
   * @param { Array } accountArray
   * @returns account number
   * @description returns a new unique idntifier based on the state of the database
   * @memberof Helpers
   */
  static genAccNumber(accountArray) {
    if (!accountArray[0]) {
      return 1234567801;
    }
    return Number(accountArray[accountArray.length - 1].account_number) + 1;
  }

  /**
   * @static
   * @param {*} to
   * @param {*} subject
   * @param {*} html
   * @description nodemailers email connection handler
   * @memberof Helpers
   */
  static async mailHandler(to, subject, html) {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SERVER_MAIL,
        pass: process.env.SERVER_MAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.SERVER_MAIL,
      // to: 'viheanaco@gmail.com',
      to,
      subject,
      html,
    };
    await transporter.sendMail(mailOptions);
  }
}

export default Helpers;
