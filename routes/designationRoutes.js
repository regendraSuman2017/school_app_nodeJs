import express from 'express';
const router = express.Router();

import { verifyToken } from '../middleware/verify_token.js';
import { insertDesignation, getDesignation, getDesignationByDepartmentId } from '../controllers/designationController.js';

router.post('', verifyToken, insertDesignation);
router.get('', verifyToken, getDesignation);
router.get('/:department_id', verifyToken, getDesignationByDepartmentId); // GET /api/class/:courseId

export default router;