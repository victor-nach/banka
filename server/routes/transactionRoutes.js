import express from 'express';
import transactionController from '../controllers/transactionController';
import transactionValidations from '../middlewares/validations/transactionValidations';
import validateResult from '../middlewares/validations/validateResult';
import Auth from '../middlewares/authentication/auth';

const router = express.Router();

const { checkDebitAccount, checkcreditAccount, checkGetSingleTrans } = transactionValidations;
const { verifyToken, verifyStaff } = Auth;

router.post('/:accountNumber/debit', checkDebitAccount, validateResult, verifyToken, verifyStaff, transactionController.debitAccount);
router.post('/:accountNumber/credit', checkcreditAccount, validateResult, verifyToken, verifyStaff, transactionController.creditAccount);
router.get('/:transactionId', checkGetSingleTrans, validateResult, verifyToken, transactionController.getSingleTransaction);

export default router;
