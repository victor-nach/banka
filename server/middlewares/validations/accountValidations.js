import validatorHelpers from '../../utils/validatorHelpers';

const {
  checkEmpty, checkAccType, checkAccStatus,
  checkMinLength, checkMaxLength, checkNumber, checkEmail,
} = validatorHelpers;

// Validate bank account creation
const checkCreateAcount = [];
checkEmpty(checkCreateAcount, 'type', 'openingBalance');
checkAccType(checkCreateAcount, 'type');
checkNumber(checkCreateAcount, 'openingBalance');
checkMaxLength(checkCreateAcount, 30, 'openingBalance');

// Validate bank account editing with patch
const checkEditAccount = [];
checkEmpty(checkEditAccount, 'status');
checkAccStatus(checkEditAccount, 'status');
checkMinLength(checkEditAccount, 10, 'accountNumber');
checkMaxLength(checkEditAccount, 10, 'accountNumber');

// Validate bank account delete
const checkDeleteAccount = [];
checkMinLength(checkDeleteAccount, 10, 'accountNumber');
checkMaxLength(checkDeleteAccount, 10, 'accountNumber');

const checkAllUserAccounts = [];
checkEmail(checkAllUserAccounts, 'email');

const checkGetBankAccounts = [];
// checkAccStatus(checkGetBankAccounts, 'status');

const checkGetSingleAccount = [];
checkMinLength(checkGetSingleAccount, 10, 'accountNumber');
checkMaxLength(checkGetSingleAccount, 10, 'accountNumber');

const accountValidations = {
  checkCreateAcount,
  checkEditAccount,
  checkAllUserAccounts,
  checkDeleteAccount,
  checkGetBankAccounts,
  checkGetSingleAccount,
};

export default accountValidations;
