import validatorHelpers from '../../utils/validatorHelpers';

const {
  checkEmpty, checkAccType, checkFloat, checkMaxLength,
} = validatorHelpers;

// Validate bank account creation
const checkCreateAcount = [];
checkEmpty(checkCreateAcount, 'type', 'openingBalance');
checkAccType(checkCreateAcount, 'type');
checkFloat(checkCreateAcount, 'openingBalance');
checkMaxLength(checkCreateAcount, 30, 'openingBalance');

const accountValidations = {
  checkCreateAcount,
};

export default accountValidations;
