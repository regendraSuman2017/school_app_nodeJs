import db from '../config/db.js';

export const insertClass = async (req, res) => {
  try {

    const { class_name, course_id, organization_id } = req.body;

    if (!class_name) {
      return res.status(400).json({
        success: false,
        errorMessage: 'class_name is required',
      });
    }

    if (!course_id) {
      return res.status(400).json({
        success: false,
        errorMessage: 'course_id is required',
      });
    }

    if (!organization_id) {
      return res.status(400).json({
        success: false,
        message: 'organization_id is required',
      });
    }



    // Insert new course
    const [result] = await db.query(
      'INSERT INTO class_master (class_name, course_id, organization_id, status, created_date, modified_date) VALUES (?, ?, ?, 1, NOW(), NOW())',
      [class_name, course_id, organization_id]
    );

    if (result.affectedRows > 0) {
      return res.status(200).json({
        success: true,
        message: 'Class name added successfully',
        data: {
          id: result.insertId,
          class_name,
          course_id,
          organization_id
        }
      });
    } else {
      return res.status(400).json({
        success: false,
        message: 'Failed to add class name'
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


export const fetchClass = async (req, res) => {
  try {

    const { organization_id } = req.query;


    if (!organization_id) {
      return res.status(400).json({
        success: false,
        message: 'Missing organization_id in query parameters',
      });
    }

    // Fetch total count
    const [countResult] = await db.query(
      'SELECT COUNT(*) as total FROM class_master WHERE organization_id = ?',
      [organization_id]
    );
    const total = countResult[0].total;

    // Fetch paginated data with course names
    const [result] = await db.query(
      'SELECT cm.*, c.courseName FROM class_master cm LEFT JOIN course_master c ON cm.course_id = c.id WHERE cm.organization_id = ?',
      [organization_id]
    );

    return res.status(200).json({
      success: true,
      message: 'class_master fetched successfully',
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      statusCode: 500,
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};

export const getClassByCourseId = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { organization_id } = req.query;

    if (!organization_id) {
      return res.status(400).json({
        success: false,
        message: 'organization_id is required in query parameters'
      });
    }

    const query = "SELECT cm.*, c.courseName FROM class_master cm JOIN course_master c ON cm.course_id = c.id WHERE cm.course_id = ? AND cm.organization_id = ?";
    const [getClassById] = await db.query(query, [courseId, organization_id]);

    if (!getClassById || getClassById.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No classes found for the given course_id and organization_id'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Class By Course Id fetched successfully',
      data: getClassById,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

export const updateClass = async (req, res) => {
  try {
    const { id, ...fields } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Class id is required',
      });
    }

    // Remove undefined or null fields
    const validFields = Object.fromEntries(
      Object.entries(fields).filter(([_, v]) => v !== undefined && v !== null)
    );

    if (Object.keys(validFields).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No valid fields provided for update',
      });
    }

    // Build SET clause dynamically
    const setClause = Object.keys(validFields)
      .map((key) => `${key} = ?`)
      .join(', ');
    const values = [...Object.values(validFields), id]; // Push id for WHERE clause

    // Optional: Check if session with ID exists
    const [existing] = await db.query('SELECT id FROM class_master WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        errorMessage: 'Class not found'
      });
    }

    // Perform the update
    const [result] = await db.query(
      `UPDATE class_master SET ${setClause} WHERE id = ?`,
      values
    );

    if (result.affectedRows > 0) {
      return res.status(200).json({
        success: true,
        message: 'Class updated successfully',
        data: { id, ...validFields },
      });
    } else {
      return res.status(500).json({
        success: false,
        message: 'Class not updated. No changes detected.',
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};


export const deleteClass = async (req, res) => {

  try {
    const { id } = req.params;

    // First check if class exists
    const [classExists] = await db.query('SELECT * FROM class_master WHERE id = ?', [id]);

    if (classExists.length === 0) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        errorMessage: 'Class not found'
      });
    }

    // Delete the class
    const [result] = await db.query('DELETE FROM class_master WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(500).json({
        success: false,
        statusCode: 500,
        errorMessage: 'Failed to delete class'
      });
    }



    if (result.affectedRows > 0) {
      return res.status(200).json({
        success: true,
        statusCode: 200,
        message: 'Class deleted successfully',
        data: {
          id
        }
      });
    } else {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        errorMessage: 'Failed to delete class'
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      statusCode: 500,
      message: 'Internal server error',
      errorMessage: error.message
    });
  }
};
