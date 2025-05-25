import mysql from 'mysql2/promise'
import 'dotenv/config'

const pool = mysql.createPool(process.env.DB_URI)

try {
    await pool.getConnection()
    console.log('Database connected successfully')
} catch (error) {
    console.error('Database connection failed:', error)
}

export default pool