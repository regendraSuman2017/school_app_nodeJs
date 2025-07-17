import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';


export const checkEmail = async (req, res) => {
    try {
             return res.status(200).json({
            success: true,
            message: 'Succes',
            error: error.message
        });
    } catch (error) {
        console.error('Error checking email:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};
