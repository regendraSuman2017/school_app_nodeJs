import express from 'express';
import {  } from '../controllers/authController.js';

const router = express.Router();

// Authentication routes
router.post('/checkEmail', validateCheckEmail, checkEmail);

export default router;
