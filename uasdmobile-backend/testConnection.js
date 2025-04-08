const sql = require("mssql");

const dbConfig = {
  user: "sa",
  password: "1234567",
  server: "127.0.0.1", // Cambiado a localhost (127.0.0.1)
  database: "FORMULARIOS",
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
  port: 1433, // Puerto configurado en SQL Server
};

async function testConnection() {
  try {
    const pool = await sql.connect(dbConfig);
    console.log("Conexión exitosa a SQL Server");
    pool.close();
  } catch (err) {
    console.error("Error al conectar a SQL Server:", err);
  }
}

testConnection();