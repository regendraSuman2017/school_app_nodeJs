import express from 'express';
import { checkEmail } from '../controllers/authController.js';
import { validateCheckEmail } from '../middleware/validation.js';

const router = express.Router();

// Authentication routes
router.post('/checkEmail', async (req, res) => {
    res.json({
        status: 'success',
        message: 'Welcome to the API checkEmail Page',
        timestamp: new Date().toISOString()
    });
})

export default router;
