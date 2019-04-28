import express from 'express';
import accountController from '../controllers/accountController';
import transactionController from '../controllers/transactionController';
import accountValidations from '../middlewares/validations/accountValidations';
import transactionValidations from '../middlewares/validations/transactionValidations';
import validateResult from '../middlewares/validations/validateResult';
import Auth from '../middlewares/authentication/auth';
import validate from '../middlewares/validations/validate';

const router = express.Router();

const {
  checkCreateAcount, checkEditAccount, checkGetBankAccounts,
  checkDeleteAccount, checkAllUserAccounts, checkGetSingleAccount,
} = accountValidations;
const { checkGetAllTrans } = transactionValidations;
const { verifyToken, verifyAdmin, verifyAccountOwner } = Auth;

router.post(
  '/',
  checkCreateAcount,
  validateResult,
  verifyToken,
  accountController.createAccount,
);
router.patch(
  '/:accountNumber',
  validate,
  checkEditAccount,
  validateResult,
  verifyToken,
  verifyAdmin,
  accountController.editAccount,
);
router.delete(
  '/:accountNumber',
  validate,
  checkDeleteAccount,
  validateResult,
  verifyToken,
  verifyAdmin,
  accountController.deleteAccount,
);
router.get(
  '/:accountNumber/transactions',
  validate,
  checkGetAllTrans,
  validateResult,
  verifyToken,
  verifyAccountOwner,
  transactionController.getTransactions,
);
router.get(
  '/:email/accounts',
  checkAllUserAccounts,
  validateResult,
  verifyToken,
  accountController.getAllUserAccounts,
);
router.get(
  '/:accountNumber', validate,
  checkGetSingleAccount,
  validateResult,
  verifyToken,
  accountController.getSingleAccount,
);
router.get(
  '/',
  checkGetBankAccounts,
  validateResult,
  verifyToken,
  verifyAdmin,
  accountController.getAllAccounts,
);

export default router;
