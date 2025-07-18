import express from 'express';
const router = express.Router();

import { verifyToken } from '../middleware/verify_token.js';
import { insertCourse, fetchCourse, updateCourse, deleteCourse } from '../controllers/courseController.js';


router.post('', verifyToken, insertCourse);
router.get('', verifyToken, fetchCourse);
router.patch('', verifyToken, updateCourse);
router.delete('/:id', verifyToken, deleteCourse);

export default router;