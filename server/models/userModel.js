import userdb from './data/userDb';
import db from './db';
import queries from './db/queries';
import helper from '../utils/helper';

const { insertUser } = queries;

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
  static async signup(firstName, lastName, email, hashedPassword) {
    try {
      const values = [email, firstName, lastName, hashedPassword];
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
  static signin(email) {
    const user = userdb.find(element => element.email === email);
    if (user === undefined) {
      const error = new Error();
      error.name = 'email_null';
      throw error;
    }
    return user;
  }
}

export default User;
