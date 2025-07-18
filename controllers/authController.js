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

        const existingUser = await db.query('INSERT INTO auth_master (emailId) VALUES (?)', [email]);
        
        if (existingUser) {
            return res.status(200).json({
                success: true,
                message: 'Email ID is available'
            });
        }else{
          
                return res.status(400).json({
                    success: false,
                    message: 'Email ID is not available'
                });
            
        }


    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};
