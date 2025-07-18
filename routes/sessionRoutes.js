import express from 'express';
const router = express.Router();

import { verifyToken } from '../middleware/verify_token.js';
import { insertSession, fetchSession, updateSession, deleteSession } from '../controllers/sessionController.js';


router.post('', verifyToken, insertSession);
router.get('', verifyToken, fetchSession);
router.patch('', verifyToken, updateSession);
router.delete('/:id', verifyToken, deleteSession);


export default router;