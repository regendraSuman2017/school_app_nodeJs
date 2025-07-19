import express from 'express';
const router = express.Router();

import { verifyToken } from '../middleware/verify_token.js';
import { insertSubjects, fetchSubjects, updateSubjects, deleteSubjects } from '../controllers/subjectsController.js';


router.post('', verifyToken, insertSubjects);
router.get('', verifyToken, fetchSubjects);
router.patch('', verifyToken, updateSubjects);
router.delete('/:id', verifyToken, deleteSubjects);

export default router;