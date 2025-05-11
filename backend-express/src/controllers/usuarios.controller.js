const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { supabase } = require("../../lib/supabase.js");

// POST /usuarios/registro
const registro = async (req, res) => {
  try {
    const {
      email,
      password,
      nombre,
      apellidos,
      dieta,
      porciones,
      preferencias_adicionales,
    } = req.body;

    if (
      !email ||
      !password ||
      password.length < 8 ||
      !nombre ||
      !apellidos
    ) {
      return res
        .status(400)
        .json({ error: "Datos inválidos o incompletos" });
    }

    const { data: sbData, error: sbError } =
      await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true, // marcado como verificado
        user_metadata: { nombre, apellidos },
      });
    if (sbError) {
      return res.status(409).json({ error: sbError.message });
    }

    await prisma.usuario.create({
      data: {
        id: sbData.user.id,
        email,
        nombre,
        apellidos,
        dieta,
        porciones,
        preferencias_adicionales,
      },
    });

    return res.status(201).json({
      message: "Registro exitoso",
      data: { id: sbData.user.id },
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ error: "Error en servidor", details: err.message });
  }
};

// GET /usuarios/perfil
const getPerfil = async (req, res) => {
  try {
    const usuario = await prisma.usuario.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        nombre: true,
        apellidos: true,
        email: true,
        alergias: true,
        calorias: true,
        dieta: true,
        porciones: true,
        preferencias_adicionales: true,
        created_at: true,
        updated_at: true,
      },
    });

    if (!usuario) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    res.json({
      message: "Perfil obtenido correctamente",
      data: {
        id: usuario.id,
        firstName: usuario.nombre,
        lastName: usuario.apellidos,
        email: usuario.email,
        allergies: usuario.alergias,
        calories: usuario.calorias,
        diet: usuario.dieta,
        servings: usuario.porciones,
        additionalPreferences: usuario.preferencias_adicionales,
        createdAt: usuario.created_at,
        updatedAt: usuario.updated_at,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error en el servidor", details: error.message });
  }
};

// PATCH /usuarios/perfil
const updatePerfil = async (req, res) => {
  try {
    const {
      nombre,
      apellidos,
      email,
      alergias,
      calorias,
      dieta,
      porciones,
      preferencias_adicionales,
    } = req.body;

    const datosActualizacion = {};

    if (nombre) datosActualizacion.nombre = nombre;
    if (apellidos) datosActualizacion.apellidos = apellidos;
    if (email) datosActualizacion.email = email;
    if (alergias !== undefined) datosActualizacion.alergias = alergias;
    if (calorias !== undefined) datosActualizacion.calorias = calorias;
    if (dieta !== undefined) datosActualizacion.dieta = dieta;
    if (porciones !== undefined) datosActualizacion.porciones = porciones;
    if (preferencias_adicionales !== undefined)
      datosActualizacion.preferencias_adicionales = preferencias_adicionales;

    await prisma.usuario.update({
      where: { id: req.user.id },
      data: datosActualizacion,
    });

    res.json({ message: "Perfil actualizado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error en el servidor", details: error.message });
  }
};

// GET /usuarios/
const getAllUsuarios = async (req, res) => {
  try {
    // TODO: Implementar lógica de roles si es necesario, por ahora se omite la verificación de admin
    // if (req.user.rol !== 'admin') {
    //   return res.status(403).json({ error: "Acceso denegado. Se requiere rol de administrador." });
    // }

    const usuarios = await prisma.usuario.findMany({
      select: {
        id: true,
        nombre: true,
        apellidos: true,
        email: true,
        dieta: true,
        porciones: true,
        created_at: true,
        updated_at: true,
      },
    });

    res.json({ message: "Usuarios obtenidos correctamente", data: usuarios });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error en el servidor", details: error.message });
  }
};

module.exports = {
  registro,
  getPerfil,
  updatePerfil,
  getAllUsuarios,
};
