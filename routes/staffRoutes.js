import express from 'express';
const router = express.Router();

import { insertStaff, getStaff } from '../controllers/staffController.js';

router.post('', insertStaff);
router.get('', getStaff);

export default router;   