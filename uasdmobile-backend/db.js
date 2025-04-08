const sql = require("mssql");

// Configuración de la base de datos
const dbConfig = {
  user: "sa", // Usuario de tu cadena de conexión
  password: "1234567", // Contraseña de tu cadena de conexión
  server: "PC_VARGAS", // Servidor de tu cadena de conexión
  database: "uasdmobile", // Base de datos de tu cadena de conexión
  options: {
    encrypt: true, // Requerido si estás usando Azure
    trustServerCertificate: true, // Según tu configuración
  },
};
// Crear una conexión
const poolPromise = new sql.ConnectionPool(dbConfig)
  .connect()
  .then((pool) => {
    console.log("Conexión a SQL Server exitosa");
    return pool;
  })
  .catch((err) => {
    console.error("Error al conectar a SQL Server", err);
  });

module.exports = {
  sql,
  poolPromise,
};