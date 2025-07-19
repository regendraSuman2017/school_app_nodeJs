import express from 'express';
const router = express.Router();

import { verifyToken } from '../middleware/verify_token.js';
import { validatePassword, validateChangePassword } from '../middleware/validation.js';
import { resetPassword, changePassword } from '../controllers/passwordController.js';

router.post("/resetPassword", validatePassword, resetPassword);
router.patch("/changePassword", verifyToken, validateChangePassword, changePassword);

export default router;
