import db from '../config/db.js';

export const insertDepartment = async (req, res) => {
    try {
        const { department_name, organization_id } = req.body;

        if (!department_name) {
            return res.status(400).json({
                success: false,
                message: 'Department name is required'
            });
        }

        const department = {
            department_name,
            organization_id,
            status: 1,
            created_at: new Date(),
            updated_at: new Date()
        };

        const existingDepartment = await db.collection('departments').findOne({
            department_name,
            organization_id
        });

        if (existingDepartment) {
            return res.status(400).json({
                success: false,
                message: 'Department name already exists'
            });
        }

        const result = await db.collection('departments').insertOne(department);

        if (result.insertedId) {
            return res.status(201).json({
                success: true,
                message: 'Department created successfully',
                data: {
                    id: result.insertedId.toString(),
                    ...department
                }
            });
        } else {
            return res.status(500).json({
                success: false,
                message: 'Failed to create department'
            });
        }
    } catch (error) {
        console.error('Error creating department:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};

export const getDepartment = async (req, res) => {
    try {
        const { organization_id } = req.query;

        if (!organization_id) {
            return res.status(400).json({
                success: false,
                message: 'Organization ID is required'
            });
        }

        const departments = await db.collection('departments').find({
            organization_id
        }).toArray();

        return res.status(200).json({
            success: true,
            message: 'Departments fetched successfully',
            data: departments
        });
    } catch (error) {
        console.error('Error fetching departments:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};

