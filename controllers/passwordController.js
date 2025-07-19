import db from '../config/db.js';

export const resetPassword = async (req, res) => {
    try {
        const { emailId, password } = req.body;
        const [existingUser] = await db.query('SELECT * FROM login_master WHERE emailId = ?', [emailId]);
        if (existingUser.length > 0) {
            await db.query('UPDATE login_master SET password = ? WHERE emailId = ?', [password, emailId]);
            return res.status(200).json({
                statusCode: 200,
                success: true,
                message: "Password reset successfully",
                data: {
                    emailId,
                    password
                }
            });
        }
        return res.status(404).json({
            statusCode: 404,
            success: false,
            message: "User not found",
            data: {
                emailId,
                password
            }
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            statusCode: 500,
            success: false,
            message: "Internal Server Error"
        });
    }
};

export const changePassword = async (req, res) => {

    const { organization_id, oldPassword, newPassword, userId } = req.body;

    try {

        // Step 1: Check old password
        const checkQuery = `SELECT * FROM login_master WHERE password = ? AND staff_id = ? AND organization_id = ? `;

        const [results] = await db.query(checkQuery, [oldPassword, userId, organization_id]);
        if (results.length === 0) {
            return res.status(400).json({
                statusCode: 400,
                success: false,
                message: "Old password doesn't match"
            });
        }


        const [existingUser] = await db.query('SELECT * FROM login_master WHERE staff_id = ? AND organization_id = ?', [userId, organization_id]);
        if (existingUser.length > 0) {
            await db.query('UPDATE login_master SET password = ? WHERE staff_id = ? AND organization_id = ?', [newPassword, userId, organization_id]);
            return res.status(200).json({
                statusCode: 200,
                success: true,
                message: "Password changed successfully",
                data: {
                    userId,
                    newPassword
                }
            });
        }
        return res.status(404).json({
            statusCode: 404,
            success: false,
            message: "User not found",
            data: {
                userId,
                newPassword
            }
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            statusCode: 500,
            success: false,
            message: "Internal Server Error"
        });
    }

};
