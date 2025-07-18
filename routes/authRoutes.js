import express from 'express';
import { checkEmail } from '../controllers/authController.js';

const router = express.Router();

// Authentication routes
router.post('/checkEmail', checkEmail);

export default router;
