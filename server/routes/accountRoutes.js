import express from 'express';
import accountController from '../controllers/accountController';
import accountValidations from '../middlewares/validations/accountValidations';
import validateResult from '../middlewares/validations/validateResult';
import Auth from '../middlewares/authentication/auth';

const router = express.Router();

const { checkCreateAcount, checkEditAccount, checkDeleteAccount } = accountValidations;
const { verifyToken, verifyAdmin } = Auth;

router.post('/', checkCreateAcount, validateResult, verifyToken, accountController.createAccount);
router.patch('/:accountNumber', checkEditAccount, validateResult, verifyToken, verifyAdmin, accountController.editAccount);
router.delete('/:accountNumber', checkDeleteAccount, validateResult, verifyToken, verifyAdmin, accountController.deleteAccount);

export default router;
