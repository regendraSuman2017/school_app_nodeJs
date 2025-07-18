import express from 'express';
import { checkEmail,signupData } from '../controllers/authController.js';

const router = express.Router();

// Authentication routes
router.post('/checkEmail', checkEmail);
router.post('/signUp', signupData);

export default router;
