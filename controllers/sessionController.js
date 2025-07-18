import db from '../config/db.js';

export const insertSession = async (req, res) => {
  try {
    const { session_name, session_start_date, session_end_date, organization_id } = req.body;

    const [result] = await db.query('INSERT INTO session (session_name, session_start_date, session_end_date, organization_id,create_date,modify_date) VALUES (?, ?, ?, ?,NOW(),NOW())', [session_name, session_start_date, session_end_date, organization_id]);

    if (result.affectedRows > 0) {

      return res.status(200).json({
        success: true,
        message: 'Session inserted successfully',
        data: {
          id: result.insertId,
          session_name,
          session_start_date,
          session_end_date,
          organization_id: organization_id
        }
      });
    } else {
      return res.status(400).json({
        success: false,
        message: 'Failed to insert products'
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

export const fetchSession = async (req, res) => {
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
      'SELECT COUNT(*) as total FROM session WHERE organization_id = ?',
      [organization_id]
    );
    const total = countResult[0].total;
    const totalPages = Math.ceil(total / limitNumber);

    // Fetch paginated data
    const [result] = await db.query(
      'SELECT * FROM session WHERE organization_id = ? LIMIT ? OFFSET ?',
      [organization_id, limitNumber, offset]
    );

    return res.status(200).json({
      success: true,
      message: 'Sessions fetched successfully',
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


export const updateSession = async (req, res) => {
  try {
    const { id, ...fields } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Session ID is required',
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
    const [existing] = await db.query('SELECT id FROM session WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Session not found' });
    }

    // Perform the update
    const [result] = await db.query(
      `UPDATE session SET ${setClause} WHERE id = ?`,
      values
    );

    if (result.affectedRows > 0) {
      return res.status(200).json({
        success: true,
        message: 'Session updated successfully',
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


export const deleteSession = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.query('DELETE FROM session WHERE id = ?', id);


    if (result.affectedRows > 0) {
      return res.status(200).json({
        success: true,
        statusCode: 200,
        message: 'Session deleted successfully',
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

