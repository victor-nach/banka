import db from './db';
import queries from './db/queries';
import helper from '../utils/helper';

const {
  insertUser, getSingleUser, getUserById, updateUserPassword,
} = queries;

class User {
  /**
   * @static signup
   * @description creates a new user entry in the database
   * @param { String } firstName
   * @param { String } lastName
   * @param { String } email
   * @param { String } hashedPassword
   * @returns { Object } the created user details
   * @memberof User
   */
  static async signup(firstName, lastName, email, hashedPassword, type, isAdmin) {
    try {
      const values = [email, firstName, lastName, hashedPassword, type || 'client', isAdmin || false];
      const { rows } = await db.query(insertUser, values);
      return helper.camelCased(rows[0]);
    } catch (error) {
      throw error;
    }
  }

  /**
   * @static signin
   * @description signs in a user
   * @param { String } firstName
   * @param { String } lastName
   * @param { String } email
   * @param { String } hashedPassword
   * @returns { Object } the created user details
   * @memberof User
   */
  static async signin(email) {
    try {
      const values = [email];
      const { rows } = await db.query(getSingleUser, values);
      if (!rows[0]) {
        const error = new Error();
        error.name = 'email_null';
        throw error;
      }
      return helper.camelCased(rows[0]);
    } catch (error) {
      throw error;
    }
  }

  /**
   * @static resetPassword
   * @description resets the user password
   * @param { String } email
   * @returns { Object } the user details
   * @memberof User
   */
  static async resetPassword(email) {
    try {
      const values = [email];
      const { rows } = await db.query(getSingleUser, values);
      if (!rows[0]) {
        const error = new Error();
        error.name = 'email_null';
        throw error;
      }
      return helper.camelCased(rows[0]);
    } catch (error) {
      throw error;
    }
  }

  /**
   * @static resetPassword
   * @description updates the new user password in the database
   * @param { String } email
   * @returns { Object } the user details
   * @memberof User
   */
  static async updatePassword(userId, token, password) {
    try {
      let values = [userId];
      const { rows } = await db.query(getUserById, values);
      if (!rows[0]) {
        const error = new Error();
        error.name = 'user_null';
        throw error;
      }
      const user = helper.camelCased(rows[0]);
      await helper.decodeToken(token, user.hashedPassword);
      const newHashedPassword = helper.hashPassword(password);
      values = [newHashedPassword, userId];
      await db.query(updateUserPassword, values);
      return user;
    } catch (error) {
      throw error;
    }
  }
}

export default User;
