import validatorHelpers from '../../utils/validatorHelpers';

const {
  checkEmpty, checkAlphabets, checkMinLength, checkMaxLength, checkEmail, noWhiteSpace,
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


const checkSignIn = [];
checkEmpty(checkSignIn, 'email', 'password');
noWhiteSpace(checkSignIn, 'email', 'password');
checkEmail(checkSignIn, 'email');

const userValidations = {
  checkSignUp,
  checkSignIn,
};

export default userValidations;
