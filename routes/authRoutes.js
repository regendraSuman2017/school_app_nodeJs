import express from 'express';
import { checkEmail, signupData, login } from '../controllers/authController.js';
import { validateCheckEmail, validateSignUp, validateLogin } from '../middleware/validation.js';

const router = express.Router();

// Authentication routes
router.post('/checkEmail', validateCheckEmail, checkEmail);
router.post('/signUp', validateSignUp, signupData);
router.post('/login', validateLogin, login);


export default router;
