import db from '../config/db.js';

export const insertCourse = async (req, res) => {
  try {

    const { courseName, organization_id } = req.body;

    if (!courseName || !organization_id) {
      return res.status(400).json({
        success: false,
        message: 'courseName and organization_id are required'
      });
    }

    // Check if course already exists
    const [existing] = await db.query(
      'SELECT * FROM course_master WHERE courseName = ? AND organization_id = ?',
      [courseName, organization_id]
    );

    if (existing.length > 0) {
      return res.status(200).json({
        success: false,
        message: 'Course already exists'
      });
    }

    // Insert new course
    const [result] = await db.query(
      'INSERT INTO course_master (courseName, organization_id, status, create_date, modify_date) VALUES (?, ?, 1, NOW(), NOW())',
      [courseName, organization_id]
    );

    if (result.affectedRows > 0) {
      return res.status(200).json({
        success: true,
        message: 'Course added successfully',
        data: {
          id: result.insertId,
          courseName,
          organization_id
        }
      });
    } else {
      return res.status(400).json({
        success: false,
        message: 'Failed to add course'
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


export const fetchCourse = async (req, res) => {
  try {

    const { organization_id, page = 1, limit = 10 } = req.query;


    if (!organization_id) {
      return res.status(400).json({
        success: false,
        message: 'Missing organization_id in query parameters',
      });
    }

    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    const offset = (pageNumber - 1) * limitNumber;

    // Fetch total count
    const [countResult] = await db.query(
      'SELECT COUNT(*) as total FROM course_master WHERE organization_id = ?',
      [organization_id]
    );
    const total = countResult[0].total;
    const totalPages = Math.ceil(total / limitNumber);

    // Fetch paginated data
    const [result] = await db.query(
      'SELECT * FROM course_master WHERE organization_id = ? LIMIT ? OFFSET ?',
      [organization_id, limitNumber, offset]
    );

    return res.status(200).json({
      success: true,
      message: 'course_master fetched successfully',
      data: result,
      pagination: {
        totalItems: total,
        currentPage: pageNumber,
        totalPages,
        pageSize: limitNumber,
      },
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


export const updateCourse = async (req, res) => {
  try {
    const { id, ...fields } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Course id is required',
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
    const [existing] = await db.query('SELECT id FROM course_master WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        errorMessage: 'Course not found'
      });
    }

    // Perform the update
    const [result] = await db.query(
      `UPDATE course_master SET ${setClause} WHERE id = ?`,
      values
    );

    if (result.affectedRows > 0) {
      return res.status(200).json({
        success: true,
        message: 'Course updated successfully',
        data: { id, ...validFields },
      });
    } else {
      return res.status(500).json({
        success: false,
        message: 'Session not updated. No changes detected.',
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


export const deleteCourse = async (req, res) => {

  try {
    const { id } = req.params;
    const [result] = await db.query('DELETE FROM course_master WHERE id = ?', id);

    if (result.affectedRows > 0) {
      return res.status(200).json({
        success: true,
        statusCode: 200,
        message: 'Course deleted successfully',
        data: {
          id
        }
      });
    } else {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        errorMessage: 'Failed to delete session'
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



