import db from '../config/db.js';

export const insertDesignation = async (req, res) => {
    try {
        const { designation_name, department_id, organization_id } = req.body;

        if (!designation_name) {
            return res.status(400).json({
                success: false,
                message: 'designation_name is required',
            });
        }

        if (!department_id) {
            return res.status(400).json({
                success: false,
                message: 'department_id is required',
            });
        }

        if (!organization_id) {
            return res.status(400).json({
                success: false,
                message: 'organization_id is required',
            });
        }

        const [designationExists] = await db.query('SELECT * FROM school_designation WHERE designation_name = ? AND organization_id = ?', [designation_name, organization_id]);
        if (designationExists.length > 0) {
            return res.status(400).json({
                success: false,
                statusCode: 400,
                message: 'Designation name already exists'
            });
        }


        const [result] = await db.query(
            'INSERT INTO school_designation (designation_name, department_id, organization_id, status, created_date, modified_date) VALUES (?, ?, ?, 1, NOW(), NOW())',
            [designation_name, department_id, organization_id]
        );

        if (result.affectedRows > 0) {
            return res.status(200).json({
                success: true,
                statusCode: 200,
                message: 'Designation name added successfully',
                data: {
                    id: result.insertId,
                    designation_name,
                    organization_id
                }
            });
        } else {
            return res.status(400).json({
                success: false,
                message: 'Failed to add department name'
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


export const getDesignation = async (req, res) => {
    try {
        const { organization_id } = req.query;

        if (!organization_id) {
            return res.status(400).json({
                success: false,
                statusCode: 400,
                message: 'organization_id is required',
            });
        }

        const [result] = await db.query('SELECT * FROM school_designation WHERE organization_id = ?', [organization_id]);
        return res.status(200).json({
            success: true,
            statusCode: 200,
            message: 'Designation name fetched successfully',
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

export const getDesignationByDepartmentId = async (req, res) => {
    try {
        const { department_id } = req.params;
        const { organization_id } = req.query;

        if (!department_id) {
            return res.status(400).json({
                success: false,
                statusCode: 400,
                message: 'department_id is required',
            });
        }

        const [result] = await db.query('SELECT * FROM school_designation WHERE department_id = ? AND organization_id = ? ', [department_id, organization_id]);
        if (!result || result.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No designations found for the given department_id'
            });
        }


        return res.status(200).json({
            success: true,
            statusCode: 200,
            message: 'Designation name fetched successfully',
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