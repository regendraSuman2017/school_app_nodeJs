import express from 'express';
const router = express.Router();

import { verifyToken } from '../middleware/verify_token.js';    
import { insertShift, getShift } from '../controllers/shiftController.js';  

router.post('', verifyToken,  insertShift);
router.get('', verifyToken, getShift);

export default router;