import express from 'express';
import userController from '../controllers/userController';
import userValidations from '../middlewares/validations/userValidations';
import validateResult from '../middlewares/validations/validateResult';

const router = express.Router();

const { checkSignUp, checkSignIn } = userValidations;

router.post('/signup', checkSignUp, validateResult, userController.signup);
router.post('/signin', checkSignIn, validateResult, userController.signin);

export default router;
