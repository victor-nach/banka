import userdb from './data/userdb';

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
  static signup(firstName, lastName, email, hashedPassword) {
    if (userdb.find(element => element.email === email)) {
      const error = new Error();
      error.name = 'email_conflict';
      throw error;
    }
    const id = userdb.length;
    const newUser = {
      id,
      email,
      firstName,
      lastName,
      hashedPassword,
      type: 'client',
      isAdmin: false,
    };
    userdb.push(newUser);
    return newUser;
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
