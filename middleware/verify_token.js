import jwt from 'jsonwebtoken';


export const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Expecting "Bearer <token>"

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Access denied. No token provided.'
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attach decoded payload to request
        next(); // Continue to the next middleware/controller
    } catch (err) {
        return res.status(498).json({
            statusCode: 498,
            success: false,
            message: 'Invalid token'
        });
    }
};


