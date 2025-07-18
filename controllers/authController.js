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


export const signupData = async (req, res) => {
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

    const [staffResult] = await db.query(query, [organizationMasterId.insertId, userName, mobileNumber, emailId, '0', '0', '0', '1']);

    const [loginMasterId] = await db.query(
      'INSERT INTO auth_master (organization_id, role_id, email_id, staff_id,parent_id, student_id,mobile_number, password) VALUES (?, ?, ?, ?, ?,?,?,?)',
      [organizationMasterId.insertId, 1, emailId, staffResult.insertId, 0, 0, mobileNumber, hashedPassword]
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
          password: hashedPassword,
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

export const login = async (req, res) => {
  try {
    const { emailId, password } = req.body;

    if (!emailId || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Step 1: Get user with organization details using JOIN
    const userQuery = `
          SELECT lm.*, om.organization_name, om.user_name AS orgUserName, om.mobile_number AS orgMobile, 
                 om.country_name, om.id AS organization_id
          FROM auth_master lm
          JOIN organization_master om ON lm.organization_id = om.id
          WHERE lm.email_id = ? OR lm.mobile_number = ? AND lm.password = ?
        `;

    const [users] = await db.query(userQuery, [emailId, emailId, password]);

    if (users.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const user = users[0];

    // Step 2: Get staff details
    const [staffRows] = await db.query(
      `SELECT * FROM staff_master WHERE organization_id = ? AND staff_id = ?`,
      [user.organization_id, user.staff_id]
    );

    const staff = staffRows[0];

    // Step 3: Get department details
    const [departmentRows] = await db.query(
      `SELECT * FROM school_department WHERE organization_id = ? AND department_id = ?`,
      [user.organization_id, staff.department_id]
    );
    const department = departmentRows[0];

    // Step 4: Get designation details
    const [designationRows] = await db.query(
      `SELECT * FROM school_designation WHERE organization_id = ? AND designation_id = ?`,
      [user.organization_id, staff.designation_id]
    );
    const designation = designationRows[0];

    // Step 5: Get shift details
    const [shiftRows] = await db.query(
      `SELECT * FROM school_shift WHERE organization_id = ? AND shift_id = ?`,
      [user.organization_id, staff.shift_id]
    );
    const shift = shiftRows[0];

    // Step 6: Generate token
    const token = jwt.sign({ id: user.id }, config.jwt.secret, {
      expiresIn: config.jwt.expiresIn,
    });

    // Step 7: Send response
    return res.status(200).json({
      success: true,
      message: 'Login Successful',
      data: {
        // User + Org
        id: user.id,
        emailId: user.emailId,
        password: user.password,
        storeName: user.storeName,
        profileImage: user.profileImage,
        userRole: user.userRole,
        schoolName: user.schoolName,
        userName: user.orgUserName,
        mobileNo: user.orgMobile,
        country: user.country,
        organizationId: user.organization_id,
        organizationName: user.organization_name,
        token,

        // Staff
        staff_id: staff.staff_id,
        staff_name: staff.staff_name,
        staff_mobile_number: staff.staff_mobile_number,
        staff_email_id: staff.staff_email_id,
        gender: staff.gender !== null && staff.gender !== undefined ? String(staff.gender) : '',
        staff_dob: staff.staff_dob,
        department_id: staff.department_id,
        designation_id: staff.designation_id,
        course_id: staff.course_id,
        class_id: staff.class_id,
        role_Id: staff.role_Id,
        date_of_joining: staff.date_of_joining,
        reporting_to: staff.reporting_to !== null && staff.reporting_to !== undefined ? String(staff.reporting_to) : '',
        profileImage: staff.profileImage,
        create_date: staff.create_date,
        modify_date: staff.modify_date,

        // Department
        departmentId: department?.department_Id,
        department_name: department?.department_name,
        department_archive: department?.archive,

        // Designation
        designationId: designation?.designation_id,
        designation_name: designation?.designation_name,
        designation_archive: designation?.archive,

        // Shift
        shift_id: shift?.shift_id,
        shift_name: shift?.shift_name,
        shift_archive: shift?.archive,
        shift_startTime: shift?.shift_startTime,
        shift_endTime: shift?.shift_endTime,
        shift_hours: shift?.shift_hours,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};