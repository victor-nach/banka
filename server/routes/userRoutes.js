import express from 'express';
import userController from '../controllers/userController';
import userValidations from '../middlewares/validations/userValidations';
import validateResult from '../middlewares/validations/validateResult';

const router = express.Router();

const { checkSignUp } = userValidations;

router.post('/signup', checkSignUp, validateResult, userController.signup);

export default router;
