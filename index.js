import express from 'express';
import authRoutes from './routes/authRoutes.js';
import sessionRoutes from './routes/sessionRoutes.js';
import courseRoutes from './routes/courseRoutes.js';
import classRoutes from './routes/classRoutes.js';
import subjectsRoutes from './routes/subjectsRoutes.js';
import passwordRoutes from './routes/passwordRoutes.js';
import departmentsRoutes from './routes/departmentRoutes.js';
import designationsRoutes from './routes/designationRoutes.js';
import shiftRoutes from './routes/shiftRoutes.js';
import staffRoutes from './routes/staffRoutes.js';

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/session', sessionRoutes);
app.use('/api/course', courseRoutes);
app.use('/api/class', classRoutes);
app.use('/api/subjects', subjectsRoutes);
app.use('/api/password', passwordRoutes);
app.use('/api/departments', departmentsRoutes);
app.use('/api/designations', designationsRoutes);
app.use('/api/shifts', shiftRoutes);
app.use('/api/staff', staffRoutes);


app.use('/home', async (req, res) => {
    res.json({
        status: 'success',
        message: 'Welcome to the Home Page',
        timestamp: new Date().toISOString()
    });
});


// Handle undefined routes (404 Not Found)
app.use((req, res) => {
    res.status(404).json({
        statusCode: 404,
        success: false,
        message: `Cannot ${req.method} ${req.originalUrl}`,
        errorMessage: `Invalid ${req.method} Method`
    });
});

// Global Error Handling Middleware (after all routes)
app.use((err, req, res, next) => {
    console.error('Unhandled Error:', err.stack);
    res.status(500).json({
        statusCode: 500,
        success: false,
        message: 'Internal Server Error',
        error: err.message
    });
});

// Handle undefined routes (404 Not Found)
// Start the server
const startServer = async () => {
    try {
        const port = 3000;
        app.listen(port, () => {
            console.log(` Server running at: http://localhost:${port}`);

        });
    } catch (error) {
        console.error('Failed to start server:', {
            message: error.message,
            stack: error.stack,
            code: error.code
        });
        process.exit(1);
    }
};

// Start server function call
startServer();
