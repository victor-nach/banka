import validatorHelpers from '../../utils/validatorHelpers';

const {
  checkEmpty, checkAccType, checkAccStatus, checkMinLength, checkMaxLength, checkNumber,
} = validatorHelpers;

// Validate bank account creation
const checkCreateAcount = [];
checkEmpty(checkCreateAcount, 'type', 'openingBalance');
checkAccType(checkCreateAcount, 'type');
checkNumber(checkCreateAcount, 'openingBalance');
checkMaxLength(checkCreateAcount, 30, 'openingBalance');

// Validate bank account editing with patch
const checkEditAccount = [];
checkEmpty(checkEditAccount, 'status', 'accountNumber');
checkAccStatus(checkEditAccount, 'status');
checkNumber(checkEditAccount, 'accountNumber');
checkMinLength(checkEditAccount, 10, 'accountNumber');
checkMaxLength(checkEditAccount, 10, 'accountNumber');

// Validate bank account delete
const checkDeleteAccount = [];
checkEmpty(checkDeleteAccount, 'accountNumber');
checkNumber(checkDeleteAccount, 'accountNumber');
checkMinLength(checkDeleteAccount, 10, 'accountNumber');
checkMaxLength(checkDeleteAccount, 10, 'accountNumber');

const accountValidations = {
  checkCreateAcount,
  checkEditAccount,
  checkDeleteAccount,
};

export default accountValidations;
