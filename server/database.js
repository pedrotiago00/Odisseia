import mysql from "mysql2/promise";

const pool = await mysql.createPool({
  host: "localhost",
  user: "root",
  password: "99661720",
  database: "projeto_integrador",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export default pool;