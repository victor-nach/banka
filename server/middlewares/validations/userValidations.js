import validatorHelpers from '../../utils/validatorHelpers';

const {
  checkEmpty, checkAlphabets, checkMinLength, checkIsAdmin,
  checkMaxLength, checkEmail, noWhiteSpace, checkUserType,
} = validatorHelpers;

// Validate sign up
const checkSignUp = [];
checkEmpty(checkSignUp, 'firstName', 'lastName', 'email', 'password');
checkAlphabets(checkSignUp, 'firstName', 'lastName');
checkMinLength(checkSignUp, 3, 'firstName', 'lastName');
checkMinLength(checkSignUp, 6, 'password');
checkMaxLength(checkSignUp, 20, 'firstName', 'lastName', 'password');
noWhiteSpace(checkSignUp, 'firstName', 'lastName', 'email', 'password');
checkEmail(checkSignUp, 'email');

const checkSignUpAdmin = [];
checkUserType(checkSignUpAdmin, 'type');
checkIsAdmin(checkSignUpAdmin, 'isAdmin');


const checkSignIn = [];
checkEmpty(checkSignIn, 'email', 'password');
noWhiteSpace(checkSignIn, 'email', 'password');
checkEmail(checkSignIn, 'email');

const checkPasswordReset = [];
checkEmpty(checkPasswordReset, 'email');
noWhiteSpace(checkPasswordReset, 'email');
checkEmail(checkPasswordReset, 'email');

const checkNewPassword = [];
checkEmpty(checkNewPassword, 'password');
noWhiteSpace(checkNewPassword, 'password');

const userValidations = {
  checkSignUp,
  checkSignIn,
  checkSignUpAdmin,
  checkPasswordReset,
  checkNewPassword,
};

export default userValidations;
