import db from '../config/db.js';

export const checkEmail = async (req, res) => {
    try {
        const { email } = req.body;
        
        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Email is required'
            });
        }

        const existingUser = await db.query('SELECT * FROM auth_master WHERE emailId = ?', [email]);
        
        if (existingUser.length > 0) {
            return res.status(200).json({
                success: true,
                message: 'Email ID is available'
            });
        }


        return res.status(200).json({
            success: true,
            message: 'Email is available'
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};
