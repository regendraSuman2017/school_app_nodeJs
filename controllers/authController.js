import db from '../config/db.js';

export const checkEmail = async (req, res) => {
    try {
const { email_id } = req.body; // Make sure you get `name` from the request

const [rows] = await db.execute('SELECT * FROM auth_master WHERE email_id = ?', [email_id]);
        
         if (rows.length > 0) {
    return res.status(200).json({
      success: false,
      message: 'Email already exists',
    });
  } else {
    return res.status(200).json({
      success: true,
      message: 'Email not available',
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
