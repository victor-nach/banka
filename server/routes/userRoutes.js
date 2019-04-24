import express from 'express';
import userController from '../controllers/userController';
import accountValidations from '../middlewares/validations/accountValidations';
import userValidations from '../middlewares/validations/userValidations';
import validateResult from '../middlewares/validations/validateResult';
import accountController from '../controllers/accountController';
import Auth from '../middlewares/authentication/auth';

const { verifyToken } = Auth;

const router = express.Router();

const { checkSignUp, checkSignIn } = userValidations;
const { checkAllUserAccounts } = accountValidations;

router.post('/auth/signup', checkSignUp, validateResult, userController.signup);
router.post('/auth/signin', checkSignIn, validateResult, userController.signin);
router.get('/user/:email/accounts', checkAllUserAccounts, validateResult, verifyToken, accountController.getAllUserAccounts);


export default router;
