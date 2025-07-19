import express from 'express';
const router = express.Router();


import { verifyToken } from '../middleware/verify_token.js';
import { insertDepartment, getDepartment } from '../controllers/departmentController.js';

router.post('', verifyToken, insertDepartment);
router.get('', verifyToken, getDepartment);
// router.patch('', verifyToken, updateDepartment);
// router.delete('/:id', verifyToken, deleteDepartment);

export default router;