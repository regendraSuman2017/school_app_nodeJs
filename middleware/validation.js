import Joi from 'joi';
import { check, validationResult } from 'express-validator';


// Email check
const validateCheckEmail = (req, res, next) => {
    const { emailId } = req.body;

    if (!emailId) {
        return res.status(400).json({
            success: false,
            message: 'Email is required',
        });
    }

    next();
};


export {
    validateCheckEmail,
};
