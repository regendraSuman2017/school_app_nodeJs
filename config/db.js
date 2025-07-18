import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  port: process.env.MYSQL_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Export the pool as default
export default pool;

// Export the test function
export const testConnection = async () => {
  try {
    const [rows] = await pool.query('SELECT NOW() AS now');
    console.log('✅ Connected to Railway MySQL! Time:', rows[0].now);
  } catch (err) {
    console.error('❌ Connection failed:', err.message);
  }
}

testConnection();
