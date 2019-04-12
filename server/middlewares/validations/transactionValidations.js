import validatorHelpers from '../../utils/validatorHelpers';

const {
  checkEmpty, checkMinLength, checkMaxLength, checkNumber,
} = validatorHelpers;

// Validate credit account
const checkcreditAccount = [];
checkEmpty(checkcreditAccount, 'accountNumber', 'amount');
checkNumber(checkcreditAccount, 'amount', 'accountNumber');
checkMinLength(checkcreditAccount, 10, 'accountNumber');
checkMaxLength(checkcreditAccount, 10, 'accountNumber');

// Validate debit account
const checkDebitAccount = [];
checkEmpty(checkDebitAccount, 'accountNumber', 'amount');
checkNumber(checkDebitAccount, 'amount', 'accountNumber');
checkMinLength(checkDebitAccount, 10, 'accountNumber');
checkMaxLength(checkDebitAccount, 10, 'accountNumber');

const transactionValidations = {
  checkDebitAccount,
  checkcreditAccount,
};

export default transactionValidations;
