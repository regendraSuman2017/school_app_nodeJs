import express from 'express';
const app = express();


app.use('/home', async (req, res) => {
    res.json({
        status: 'success',
        message: 'Welcome to the Home Page',
        timestamp: new Date().toISOString()
    });
})

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