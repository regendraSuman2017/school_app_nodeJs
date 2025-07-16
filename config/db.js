import mysql from 'mysql2';
import config from './config.js';

const pool = mysql.createPool({
    host: config.database.host,
    user: config.database.user,
    password: config.database.password,
    database: config.database.name,
    waitForConnections: true,
    connectionLimit: config.database.connectionLimit || 10,
    queueLimit: 0
});

// Convert pool to use promises
const promisePool = pool.promise();

export default promisePool;