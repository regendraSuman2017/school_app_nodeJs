import dotenv from 'dotenv';
dotenv.config();

const config = {
    port: process.env.PORT || 3000,
    database: {
        host: process.env.MYSQL_HOST || 'localhost',
        user: process.env.MYSQL_USER || 'root',
        password: process.env.MYSQL_PASSWORD || '',
        name: process.env.MYSQL_DATABASE || 'railway',
        port: process.env.MYSQL_PORT || 3308,
        connectionLimit: 10
    },
    jwt: {
        secret: process.env.JWT_SECRET || 'school_app_secret_key',
        expiresIn: '2h'
    },
    env: process.env.NODE_ENV || 'development'
};

export default config;
