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
      [nombre, cuit, email || null, telefono || null, direccion || null]
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

  try {
    const actual = await pool.query(
      "SELECT * FROM empresas WHERE id_empresa = $1",
      [id]
    );
    if (actual.rows.length === 0) {
      return res.status(404).json({ mensaje: "Empresa no encontrada" });
    }

    // Los campos que no vienen en el body mantienen su valor actual.
    // Los que vienen vacíos ("" o null) se guardan como null.
    const body = req.body ?? {};
    const valor = (campo) => {
      if (!(campo in body)) return actual.rows[0][campo];
      return body[campo] === "" ? null : body[campo];
    };
    const empresa = {
      nombre: valor("nombre"),
      cuit: valor("cuit"),
      email: valor("email"),
      telefono: valor("telefono"),
      direccion: valor("direccion"),
      activo: valor("activo") ?? true
    };

    if (!empresa.nombre || !empresa.cuit) {
      return res.status(400).json({ mensaje: "Los campos nombre y cuit no pueden quedar vacíos" });
    }

    const resultado = await pool.query(
      `UPDATE empresas SET
         nombre = $1, cuit = $2, email = $3, telefono = $4, direccion = $5, activo = $6
       WHERE id_empresa = $7
       RETURNING *`,
      [empresa.nombre, empresa.cuit, empresa.email, empresa.telefono, empresa.direccion, empresa.activo, id]
    );
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
