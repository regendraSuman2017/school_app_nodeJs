import db from '../config/db.js';

export  const insertShift = async (req, res)=>{
    try {
        const { shift_name, start_time, end_time, organization_id } = req.body;

        const [shiftExists] = await db.query('SELECT * FROM school_shift WHERE shift_name = ? AND organization_id = ?', [shift_name, organization_id]);
        if(shiftExists.length > 0){
            return res.status(400).json({
                success: false,
                statusCode: 400,
                message: 'Shift name already exists'
            });
        }

        const [result] = await db.query(
            'INSERT INTO school_shift (shift_name, start_time, end_time, organization_id, status, created_date, modified_date) VALUES (?, ?, ?, ?, 1, NOW(), NOW())',
            [shift_name, start_time, end_time, organization_id]
        );

        if (result.affectedRows > 0) {
            return res.status(200).json({
                success: true,
                statusCode: 200,
                message: 'Shift name added successfully',
                data: {
                    id: result.insertId,
                    shift_name,
                    organization_id
                }
            });
        } else {
            return res.status(400).json({
                success: false,
                message: 'Failed to add shift name'
            });
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};  

export const getShift = async (req, res)=>{
    try {
        const { organization_id } = req.query;

        if (!organization_id) {
            return res.status(400).json({
                success: false,
                statusCode: 400,
                message: 'organization_id is required',
            });
        }

        const [result] = await db.query('SELECT * FROM school_shift WHERE organization_id = ?', [organization_id]);
        return res.status(200).json({
            success: true,
            statusCode: 200,
            message: 'Shift name fetched successfully',
            data: result
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};
