import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';


export const checkEmail = async (req, res) => {
    try {
        const { emailId } = req.body;

        const existingUser = await db.query('SELECT * FROM auth_master');

        if (existingUser.length > 0) {
            return res.status(200).json({
                success: true,
                message: "Email exists",
                data: {
                    emailId,
                    password: existingUser[0].password
                }
            });
        }

        return res.status(400).json({
            success: false,
            message: "Email does not exist"
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
