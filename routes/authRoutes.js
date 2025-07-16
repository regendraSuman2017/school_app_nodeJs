import express from 'express';
import { checkEmail } from '../controllers/authController.js';
import { validateCheckEmail } from '../middleware/validation.js';

const router = express.Router();

// Authentication routes
router.post('/checkEmail', validateCheckEmail, checkEmail);

export default router;
