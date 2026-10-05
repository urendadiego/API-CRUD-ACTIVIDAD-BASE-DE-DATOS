import pool from "../data/db.js";

// Código de error de PostgreSQL para violación de UNIQUE (cuit repetido)
const UNIQUE_VIOLATION = "23505";

const idValido = (id) => /^\d+$/.test(id);

export const obtenerEmpresas = async (req, res) => {
  try {
    const resultado = await pool.query("SELECT * FROM empresas ORDER BY id_empresa");
    res.json(resultado.rows);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener las empresas" });
  }
};

export const obtenerEmpresa = async (req, res) => {
  const { id } = req.params;
  if (!idValido(id)) {
    return res.status(400).json({ mensaje: "El id debe ser un número entero" });
  }

  try {
    const resultado = await pool.query(
      "SELECT * FROM empresas WHERE id_empresa = $1",
      [id]
    );
    if (resultado.rows.length === 0) {
      return res.status(404).json({ mensaje: "Empresa no encontrada" });
    }
    res.json(resultado.rows[0]);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener la empresa" });
  }
};

export const crearEmpresa = async (req, res) => {
  const { nombre, cuit, email, telefono, direccion } = req.body ?? {};

  if (!nombre || !cuit) {
    return res.status(400).json({ mensaje: "Los campos nombre y cuit son obligatorios" });
  }

  try {
    const resultado = await pool.query(
      `INSERT INTO empresas (nombre, cuit, email, telefono, direccion)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [nombre, cuit, email ?? null, telefono ?? null, direccion ?? null]
    );
    res.status(201).json(resultado.rows[0]);
  } catch (error) {
    if (error.code === UNIQUE_VIOLATION) {
      return res.status(400).json({ mensaje: "Ya existe una empresa con ese cuit" });
    }
    res.status(500).json({ mensaje: "Error al crear la empresa" });
  }
};

export const editarEmpresa = async (req, res) => {
  const { id } = req.params;
  if (!idValido(id)) {
    return res.status(400).json({ mensaje: "El id debe ser un número entero" });
  }

  const { nombre, cuit, email, telefono, direccion, activo } = req.body ?? {};

  // COALESCE: si un campo no se envía, se mantiene el valor actual
  try {
    const resultado = await pool.query(
      `UPDATE empresas SET
         nombre = COALESCE($1, nombre),
         cuit = COALESCE($2, cuit),
         email = COALESCE($3, email),
         telefono = COALESCE($4, telefono),
         direccion = COALESCE($5, direccion),
         activo = COALESCE($6, activo)
       WHERE id_empresa = $7
       RETURNING *`,
      [nombre, cuit, email, telefono, direccion, activo, id]
    );
    if (resultado.rows.length === 0) {
      return res.status(404).json({ mensaje: "Empresa no encontrada" });
    }
    res.json(resultado.rows[0]);
  } catch (error) {
    if (error.code === UNIQUE_VIOLATION) {
      return res.status(400).json({ mensaje: "Ya existe una empresa con ese cuit" });
    }
    res.status(500).json({ mensaje: "Error al editar la empresa" });
  }
};

export const eliminarEmpresa = async (req, res) => {
  const { id } = req.params;
  if (!idValido(id)) {
    return res.status(400).json({ mensaje: "El id debe ser un número entero" });
  }

  try {
    const resultado = await pool.query(
      "DELETE FROM empresas WHERE id_empresa = $1 RETURNING id_empresa",
      [id]
    );
    if (resultado.rows.length === 0) {
      return res.status(404).json({ mensaje: "Empresa no encontrada" });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ mensaje: "Error al eliminar la empresa" });
  }
};
