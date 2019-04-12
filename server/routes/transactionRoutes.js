import express from 'express';
import transactionController from '../controllers/transactionController';
import transactionValidations from '../middlewares/validations/transactionValidations';
import validateResult from '../middlewares/validations/validateResult';
import Auth from '../middlewares/authentication/auth';

const router = express.Router();

const { checkDebitAccount } = transactionValidations;

router.post('/:accountNumber/debit', checkDebitAccount, validateResult, Auth.verifyToken, transactionController.debitAccount);

export default router;
