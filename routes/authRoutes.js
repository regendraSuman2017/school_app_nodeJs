import express from 'express';
import { checkEmail, signupData } from '../controllers/authController.js';
import { validateCheckEmail, validateSignUp } from '../middleware/validation.js';

const router = express.Router();

// Authentication routes
router.post('/checkEmail', validateCheckEmail, checkEmail);
router.post('/signUp', validateSignUp, signupData);

export default router;
