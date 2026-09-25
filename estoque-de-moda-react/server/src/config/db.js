import mysql from "mysql2/promise";
import "dotenv/config";

export const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "estoque_moda",

  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export async function testarConexao() {
  try {
    const conexao = await pool.getConnection();

    console.log("Conexão com o MySQL realizada com sucesso!");

    conexao.release();
  } catch (erro) {
    console.error("Erro ao conectar ao MySQL:");
    console.error(erro.message);

    throw erro;
  }
}