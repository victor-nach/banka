import express from 'express';
import accountController from '../controllers/accountController';
import accountValidations from '../middlewares/validations/accountValidations';
import validateResult from '../middlewares/validations/validateResult';
import Auth from '../middlewares/authentication/auth';

const router = express.Router();

const { checkCreateAcount, checkEditAccount, checkDeleteAccount } = accountValidations;

router.post('/', checkCreateAcount, validateResult, Auth.verifyToken, accountController.createAccount);
router.patch('/:accountNumber', checkEditAccount, validateResult, Auth.verifyToken, accountController.editAccount);
router.delete('/:accountNumber', checkDeleteAccount, validateResult, Auth.verifyToken, accountController.deleteAccount);

export default router;
