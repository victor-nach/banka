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

// Validate get all transactions
const checkGetAllTrans = [];
checkEmpty(checkGetAllTrans, 'accountNumber');
checkNumber(checkGetAllTrans, 'accountNumber');
checkMinLength(checkGetAllTrans, 10, 'accountNumber');
checkMaxLength(checkGetAllTrans, 10, 'accountNumber');

// Validate get all transactions
const checkGetSingleTrans = [];
checkEmpty(checkGetSingleTrans, 'transactionId');
checkNumber(checkGetSingleTrans, 'transactionId');


const transactionValidations = {
  checkDebitAccount,
  checkcreditAccount,
  checkGetSingleTrans,
  checkGetAllTrans,
};

export default transactionValidations;
