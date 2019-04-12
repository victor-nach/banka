import validatorHelpers from '../../utils/validatorHelpers';

const {
  checkEmpty, checkMinLength, checkMaxLength, checkNumber,
} = validatorHelpers;

// Validate debit account
const checkDebitAccount = [];
checkEmpty(checkDebitAccount, 'accountNumber', 'amount');
checkNumber(checkDebitAccount, 'amount', 'accountNumber');
checkMinLength(checkDebitAccount, 10, 'accountNumber');
checkMaxLength(checkDebitAccount, 10, 'accountNumber');

const transactionValidations = {
  checkDebitAccount,
};

export default transactionValidations;
