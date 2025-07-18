import express from 'express';
const router = express.Router();

import { verifyToken } from '../middleware/verify_token.js';
import { insertClass, fetchClass, getClassByCourseId, updateClass, deleteClass } from '../controllers/classController.js';


router.post('', verifyToken, insertClass);
router.get('', verifyToken, fetchClass);
router.get('/:courseId', verifyToken, getClassByCourseId); // GET /api/class/:courseId
router.patch('', verifyToken, updateClass);
router.delete('/:id', verifyToken, deleteClass);

export default router;