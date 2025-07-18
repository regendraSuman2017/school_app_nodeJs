import db from '../config/db.js';

export const checkEmail = async (req, res) => {
  try {
    const { emailId } = req.body;

    const existingUser = await db.query('SELECT * FROM auth_master WHERE email_id = ?', [emailId]);

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


const signupData = async (req, res) => {
    try {
        const { organizationType, organizationName, userName, mobileNumber, emailId, password, country } = req.body;
        
        const [checkEmail] = await db.query('SELECT * FROM organization_master WHERE email_id = ?', [emailId]); 
        if (checkEmail.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Email already exists'
            });
        }       

        const [checkMobileNo] = await db.query('SELECT * FROM organization_master WHERE mobile_number = ?', [mobileNumber]); 
        if (checkMobileNo.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Mobile number already exists'
            });
        }       

        const [organizationMasterId] = await db.query(
            'INSERT INTO organization_master (`organization_name`, `organization_type`, `user_name`, `mobile_number`, `email_id`, `password`, `country_code`, `country_name`, `created_date`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [organizationName, organizationType, userName, mobileNumber, emailId, password, country, country, new Date()]
        );

        const query = `
    INSERT INTO staff_master (
      organization_id,  
      staff_name, 
      staff_mobile_number, 
      staff_email_id, 
      department_id,
      designation_id,
      shift_id,
      role_id,
      date_of_joining,
      course_id,
      class_id,
      create_date,
      modify_date
    ) VALUES (?, ?, ?, ?, ?, ?, ?, '1' ,NOW(),'0','0',NOW(), NOW())`;

        const [staffResult] =  await db.query(query, [organizationMasterId.insertId, userName, mobileNumber, emailId, '0', '0', '0', '1']);

        const [loginMasterId] = await db.query(
            'INSERT INTO auth_master (organization_id, role_id, email_id, staff_id,parent_id, student_id,mobile_number, password) VALUES (?, ?, ?, ?, ?,?,?,?)',
            [organizationMasterId.insertId, 1,emailId,  staffResult.insertId, 0,0, mobileNumber, hashedPassword]
        );

        if (organizationMasterId.affectedRows > 0) {
            return res.status(200).json({
                success: true,
                message: 'User registered successfully',
                data: {
                    id: organizationMasterId.insertId,
                    userName,
                    emailId,
                    organizationName,
                    mobileNumber,
                    country,    
                    password : hashedPassword, 
                }
            });
        } else {
            return res.status(400).json({
                success: false,
                message: 'Failed to register user'
            });
        }   
    } catch (error) {
        console.error('Error in signupData:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};
