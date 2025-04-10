const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const sql = require("mssql");

// Configuración de la base de datos
const dbConfig = {
    user: "sa",
    password: "1234567",
    server: "_PC_VARGAS_",
    database: "uasdmobile",
    options: {
        encrypt: false,
        trustServerCertificate: true,
    },
    port: 1433,
};

// Crear el servidor
const app = express();
const port = 4000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Ruta para la raíz
app.get("/", (req, res) => {
    res.send("Bienvenido al backend de UASD Mobile");
});

// Ruta: Obtener todas las asignaturas
app.get("/asignaturas", async (req, res) => {
    try {
        const pool = await sql.connect(dbConfig);
        const result = await pool.request().query("SELECT * FROM Asignaturas");
        res.json(result.recordset);
    } catch (err) {
        console.error("Error al obtener asignaturas:", err.message);
        res.status(500).send("Error al obtener asignaturas");
    }
});

// Ruta: Obtener asignaturas por plan de estudio
app.get("/asignaturas/:planId", async (req, res) => {
    const { planId } = req.params;

    try {
        const pool = await sql.connect(dbConfig);
        const result = await pool
            .request()
            .input("planId", sql.Int, planId)
            .query("SELECT * FROM Asignaturas WHERE planId = @planId");
        res.json(result.recordset);
    } catch (err) {
        console.error("Error al obtener asignaturas del plan:", err.message);
        res.status(500).send("Error al obtener asignaturas del plan");
    }
});

// Ruta: Crear una nueva asignatura
app.post("/asignaturas", async (req, res) => {
    const {
        id,
        nombre,
        creditos,
        horasPracticas,
        horasTeoricas,
        prerequisitos,
        semestre,
        equivalente,
        planId,
    } = req.body;

    if (
        !id ||
        !nombre ||
        !creditos ||
        !horasPracticas ||
        !horasTeoricas ||
        !prerequisitos ||
        !semestre ||
        !equivalente ||
        !planId
    ) {
        return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }

    try {
        const pool = await sql.connect(dbConfig);
        await pool
            .request()
            .input("id", sql.VarChar, id)
            .input("nombre", sql.VarChar, nombre)
            .input("creditos", sql.Int, creditos)
            .input("horasPracticas", sql.Int, horasPracticas)
            .input("horasTeoricas", sql.Int, horasTeoricas)
            .input("prerequisitos", sql.VarChar, prerequisitos)
            .input("semestre", sql.Int, semestre)
            .input("equivalente", sql.VarChar, equivalente)
            .input("planId", sql.Int, planId)
            .query(
                "INSERT INTO Asignaturas (id, nombre, creditos, horasPracticas, horasTeoricas, prerequisitos, semestre, equivalente, planId) VALUES (@id, @nombre, @creditos, @horasPracticas, @horasTeoricas, @prerequisitos, @semestre, @equivalente, @planId)"
            );

        res.status(201).json({ message: "Asignatura creada exitosamente" });
    } catch (err) {
        console.error("Error al crear la asignatura:", err.message);
        res.status(500).send("Error al crear la asignatura");
    }
});

// Ruta: Editar una asignatura
app.put("/asignaturas/:id", async (req, res) => {
    const { id } = req.params;
    const {
        nombre,
        creditos,
        horasPracticas,
        horasTeoricas,
        prerequisitos,
        semestre,
        equivalente,
    } = req.body;

    if (
        !nombre ||
        !creditos ||
        !horasPracticas ||
        !horasTeoricas ||
        !prerequisitos ||
        !semestre ||
        !equivalente
        
    ) {
        return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }

    try {
        const pool = await sql.connect(dbConfig);
        const result = await pool
            .request()
            .input("id", sql.VarChar, id)
            .input("nombre", sql.VarChar, nombre)
            .input("creditos", sql.Int, creditos)
            .input("horasPracticas", sql.Int, horasPracticas)
            .input("horasTeoricas", sql.Int, horasTeoricas)
            .input("prerequisitos", sql.VarChar, prerequisitos)
            .input("semestre", sql.Int, semestre)
            .input("equivalente", sql.VarChar, equivalente)
            .query(
                "UPDATE Asignaturas SET nombre = @nombre, creditos = @creditos, horasPracticas = @horasPracticas, horasTeoricas = @horasTeoricas, prerequisitos = @prerequisitos, semestre = @semestre, equivalente = @equivalente WHERE id = @id"
            );

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ error: "Asignatura no encontrada" });
        }

        res.status(200).json({ message: "Asignatura actualizada exitosamente" });
    } catch (err) {
        console.error("Error al actualizar la asignatura:", err.message);
        res.status(500).send("Error al actualizar la asignatura");
    }
});

// Ruta: Eliminar una asignatura
app.delete("/asignaturas/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const pool = await sql.connect(dbConfig);
        const result = await pool
            .request()
            .input("id", sql.VarChar, id)
            .query("DELETE FROM Asignaturas WHERE id = @id");

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ error: "Asignatura no encontrada" });
        }

        res.status(200).json({ message: "Asignatura eliminada exitosamente" });
    } catch (err) {
        console.error("Error al eliminar la asignatura:", err.message);
        res.status(500).send("Error al eliminar la asignatura");
    }
});

// Ruta: Obtener todos los planes de estudio
app.get("/planes", async (req, res) => {
    try {
        const pool = await sql.connect(dbConfig);
        const result = await pool.request().query("SELECT id, nombre, codigo, competencia, fechaCreacion FROM Planes");
        res.json(result.recordset);
    } catch (err) {
        console.error("Error al obtener planes de estudio:", err.message);
        res.status(500).send("Error al obtener planes de estudio");
    }
});

// Ruta: Crear un nuevo plan
app.post("/planes", async (req, res) => {
    const { nombre, codigo, competencia } = req.body;

    if (!nombre || !codigo || !competencia) {
        return res.status(400).send("Todos los campos son obligatorios");
    }

    try {
        const pool = await sql.connect(dbConfig);
        await pool
            .request()
            .input("nombre", sql.VarChar, nombre)
            .input("codigo", sql.VarChar, codigo)
            .input("competencia", sql.VarChar, competencia)
            .input("fechaCreacion", sql.DateTime, new Date())
            .query(
                "INSERT INTO Planes (nombre, codigo, competencia, fechaCreacion) VALUES (@nombre, @codigo, @competencia, @fechaCreacion)"
            );
        res.send("Plan agregado correctamente");
    } catch (err) {
        console.error("Error al agregar plan:", err.message);
        res.status(500).send("Error al agregar plan");
    }
});
// Ruta: Eliminar un plan por ID
app.delete("/planes/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const pool = await sql.connect(dbConfig);
        await pool
            .request()
            .input("id", sql.Int, id)
            .query("DELETE FROM Planes WHERE id = @id");
        res.send("Plan eliminado correctamente");
    } catch (err) {
        console.error("Error al eliminar plan:", err.message);
        res.status(500).send("Error al eliminar plan");
    }
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});