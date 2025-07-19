import db from '../config/db.js';
export const insertStaff = async (req, res)=>{
    try {
        const { name, email_id, mobile_number,gender,staff_dob,department_id,designation_id,shift_id,course_id,class_id,role_id,date_of_joining,profileImage,organization_id } = req.body;

        const [staffExists] = await db.query('SELECT * FROM staff_master WHERE email_id = ? AND organization_id = ?', [email_id, organization_id]);
        if(staffExists.length > 0){
            return res.status(400).json({
                success: false,
                statusCode: 400,
                message: 'email_id already exists'
            });
        }

        
        const [staffMobileExist] = await db.query('SELECT * FROM staff_master WHERE mobile_number = ? AND organization_id = ?', [mobile_number, organization_id]);
        if(staffMobileExist.length > 0){
            return res.status(400).json({
                success: false,
                statusCode: 400,
                message: 'mobile_number already exists'
            });
        }

        const [result] = await db.query(
            'INSERT INTO staff_master (`staff_name`, `mobile_number`, `email_id`, `gender`, `staff_dob`, `department_id`, `designation_id`, `shift_id`, `course_id`, `class_id`, `role_id`, `date_of_joining`, `profileImage`, `organization_id`, `status`,`create_date`, `modify_date` ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())',
            [name, mobile_number, email_id, gender, staff_dob, department_id, designation_id, shift_id, course_id, class_id, role_id, date_of_joining, profileImage, organization_id, '1']
        );

        if (result.affectedRows > 0) {
            return res.status(200).json({
                success: true,
                statusCode: 200,
                message: 'Staff added successfully',
                data: {
                    id: result.insertId,
                    name,
                    email_id,
                    mobile_number,
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
}  ;

export const getStaff = async (req, res)=>{
    try {
        const { organization_id } = req.query;
        let query = `
            SELECT 
                sm.*,
                dm.department_name,
                des.designation_name,
                cm.class_name
            FROM 
                staff_master sm
            LEFT JOIN 
                school_department dm ON sm.department_id = dm.department_id
            LEFT JOIN 
                school_designation des ON sm.designation_id = des.designation_id
            LEFT JOIN 
                class_master cm ON sm.class_id = cm.id
        `;

        const params = [];
        if (organization_id) {
            query += ` WHERE sm.organization_id = ?`;
            params.push(organization_id);
        }

        const [result] = await db.query(query, params);

        return res.status(200).json({
            success: true,
            statusCode: 200,
            message: 'Staff data fetched successfully',
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