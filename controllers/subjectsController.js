import db from '../config/db.js';

export const insertSubjects = async (req, res) => {
    try {
        const { subject_name, class_id, course_id, organization_id } = req.body;

        if (!subject_name) {
            return res.status(400).json({
                success: false,
                message: 'subject_name is required',
            });
        }

        if (!class_id) {
            return res.status(400).json({
                success: false,
                message: 'class_id is required',
            });
        }

        if (!course_id) {
            return res.status(400).json({
                success: false,
                message: 'course_id is required',
            });
        }

        if (!organization_id) {
            return res.status(400).json({
                success: false,
                message: 'organization_id is required',
            });
        }

        const [existing] = await db.query(
            'SELECT * FROM subjects WHERE subject_name = ? AND class_id = ? AND course_id = ? AND organization_id = ?',
            [subject_name, class_id, course_id, organization_id]
        );

        if (existing.length > 0) {
            return res.status(400).json({
                success: false,
                statusCode: 400,
                message: 'Subject already exists'
            });
        }

        const [result] = await db.query(
            'INSERT INTO subjects (subject_name, class_id, course_id, organization_id, status, created_date, updated_date) VALUES (?, ?, ?, ?, 1, NOW(), NOW())',
            [subject_name, class_id, course_id, organization_id]
        );

        if (result.affectedRows > 0) {
            return res.status(200).json({
                success: true,
                statusCode: 200,
                message: 'Subject added successfully',
                data: {
                    id: result.insertId,
                    subject_name,
                    class_id,
                    course_id,
                    organization_id
                }
            });
        } else {
            return res.status(400).json({
                success: false,
                message: 'Failed to add subject'
            });
        }
    } catch (error) {
        console.error('Add subject error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};

export const fetchSubjects = async (req, res) => {
    try {
        const { organization_id } = req.query;

        // Validate organization_id
        if (!organization_id) {
            return res.status(400).json({
                success: false,
                statusCode: 400,
                message: 'organization_id is required'
            });
        }

        // Fetch subjects with course and class names
        const query = `
            SELECT s.*, c.courseName, cl.class_name 
            FROM subjects s 
            INNER JOIN course_master c ON s.course_id = c.id 
            INNER JOIN class_master cl ON s.class_id = cl.id 
            WHERE s.organization_id = ? AND s.status = 1
        `;
        const [subjects] = await db.query(query, [organization_id]);

        if (subjects.length === 0) {
            return res.status(200).json({
                success: true,
                statusCode: 200,
                message: 'No subjects found for the given organization',
                data: subjects
            });
        }

        return res.status(200).json({
            success: true,
            statusCode: 200,
            message: 'Subjects fetched successfully',
            data: subjects
        });

    } catch (error) {
        console.error('Error fetching subjects:', error);
        return res.status(500).json({
            success: false,
            statusCode: 500,
            message: 'Internal server error',
            error: error.message
        });
    }
};

export const updateSubjects = async (req, res) => {
    try {
        const { id, ...fields } = req.body;

    } catch (error) {

    }
}

export const deleteSubjects = async (req, res) => {
    try {

    } catch (error) {

    }
}

