import validatorHelpers from '../../utils/validatorHelpers';

const {
  checkEmpty, checkAlphabets, checkMaxLength, checkMinLength, checkEmail, checkWhiteSpace,
} = validatorHelpers;

// Validate sign up
const checkSignUp = [];
checkEmpty(checkSignUp, 'firstName', 'lastName', 'email', 'password');
checkAlphabets(checkSignUp, 'firstName', 'lastName');
checkMinLength(checkSignUp, 3, 'firstName', 'lastName');
checkMinLength(checkSignUp, 6, 'password');
checkMaxLength(checkSignUp, 20, 'firstName', 'lastName', 'password');
checkWhiteSpace(checkSignUp, 'firstName', 'lastName', 'email', 'password');
checkEmail(checkSignUp, 'email');

const userValidations = {
  checkSignUp,
};

export default userValidations;
