import { check } from 'express-validator/check';

class ValidatorHelpers {
  /**
   * @static checkEmpty
   * @description checks if input field is empty
   * @param { array } route
   * @param { String } fields one or more input fields
   * @memberof ValidatorHelpers
   */
  static checkEmpty(route, ...fields) {
    fields.forEach((field) => {
      route.push(check(field).isLength({ min: 1 }).withMessage(`kindly put in the user's ${field}`));
    });
  }

  /**
   * @static checkAlphabets
   * @description checks if input field contains only alphabets
   * @param { array } route
   * @param { String } fields one or more input fields
   * @memberof ValidatorHelpers
   */
  static checkAlphabets(route, ...fields) {
    fields.forEach((field) => {
      route.push(check(field).trim().matches(/^[a-zA-Z ]+$/).withMessage(`The user's ${field} should only contain alphabets`));
    });
  }

  /**
   * @static checkWhiteSpace
   * @description checks if input field contains any white space in between
   * @param { array } route
   * @param { String } fields one or more input fields
   * @memberof ValidatorHelpers
   */
  static checkWhiteSpace(route, ...fields) {
    fields.forEach((field) => {
      route.push(check(field).trim().matches(/^\S{3,}$/).withMessage(`The user's ${field} should not contain spaces in between the characters`));
    });
  }

  /**
   * @static checkMinLength
   * @description checks the minimum length of characters for theinput field
   * @param { Array } route
   * @param { Integer } minLength
   * @param { String } fields one or more input fields
   * @memberof ValidatorHelpers
   */
  static checkMinLength(route, minLength, ...fields) {
    fields.forEach((field) => {
      route.push(check(field).trim().isLength({ min: minLength }).withMessage(`The user's ${field} must contain at least ${minLength} characters`));
    });
  }

  /**
   * @static checkMaxLength
   * @description checks the required maximum length of characters for the input field
   * @param { Array } route
   * @param { Integer } maxLength
   * @param { String } fields one or more input fields
   * @memberof ValidatorHelpers
   */
  static checkMaxLength(route, maxLength, ...fields) {
    fields.forEach((field) => {
      route.push(check(field).trim().isLength({ max: maxLength }).withMessage(`The user's ${field} must not contain more than ${maxLength} characters`));
    });
  }

  /**
   * @static checkEmail
   * @description checks for  a valid email address
   * @param { Array } route
   * @param { String } email
   * @memberof ValidatorHelpers
   */
  static checkEmail(route, email) {
    route.push(check(email).trim().isEmail().withMessage('please put in a valid email address'));
  }
}

export default ValidatorHelpers;
