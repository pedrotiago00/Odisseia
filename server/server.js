import pool from "./database.js";

async function buscarUsuarios() {
  const [rows] = await pool.query("SELECT * FROM usuarios");
  console.log(rows);
}

buscarUsuarios();