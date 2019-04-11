import express from 'express';
import accountController from '../controllers/accountController';
import accountValidations from '../middlewares/validations/accountValidations';
import validateResult from '../middlewares/validations/validateResult';
import Auth from '../middlewares/authentication/auth';

const router = express.Router();

const { checkCreateAcount, checkEditAccount } = accountValidations;

router.post('/', checkCreateAcount, validateResult, Auth.verifyToken, accountController.createAccount);
router.patch('/:accountNumber', checkEditAccount, validateResult, Auth.verifyToken, accountController.editAccount);

export default router;
