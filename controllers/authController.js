import db from '../config/db.js';

export const checkEmail = async (req, res) => {
    try {
const { name } = req.body; // Make sure you get `name` from the request

const [result] = await db.execute('INSERT INTO category (name) VALUES (?)', [name]);
        
        if (result) {
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
