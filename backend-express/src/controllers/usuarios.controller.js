const { PrismaClient } = require("@prisma/client");
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "Email y contraseña son requeridos" });
        }

        const usuarioExistente = await prisma.usuario.findUnique({ where: { email } });

        if (!usuarioExistente) {
            return res.status(401).json({ error: "Credenciales inválidas" });
        }

        if (!usuarioExistente.activo) {
            return res.status(401).json({ error: 'La cuenta está desactivada.' });
        }

        const passwordMatch = await bcrypt.compare(password, usuarioExistente.password);

        if (!passwordMatch) {
            return res.status(401).json({ error: "Credenciales inválidas" });
        }

        // Mapeo de los campos del usuario a etiquetas en inglés
        res.json({
            message: "Inicio de sesión exitoso",
            data: {
                id: usuarioExistente.id,
                firstName: usuarioExistente.nombre,
                lastName: usuarioExistente.apellidos,
                email: usuarioExistente.email,
                admin: usuarioExistente.admin,
                active: usuarioExistente.activo,
                allergies: usuarioExistente.alergias,
                calories: usuarioExistente.calorias,
                diet: usuarioExistente.dieta,
                servings: usuarioExistente.porciones,
                additionalPreferences: usuarioExistente.preferencias_adicionales,
                createdAt: usuarioExistente.created_at,
                updatedAt: usuarioExistente.updated_at
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error en el servidor", details: error.message });
    }
};

const registro = async (req, res) => {
    try {
        const { nombre, apellidos, email, password, dieta, porciones, preferencias_adicionales } = req.body;

        if (!nombre || !apellidos || !email || !password || password.length < 8) {
            return res.status(400).json({ error: "Datos inválidos o incompletos" });
        }

        const usuarioExistente = await prisma.usuario.findUnique({ where: { email } });
        if (usuarioExistente) {
            return res.status(409).json({ error: "El email ya está registrado" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const nuevoUsuario = await prisma.usuario.create({
            data: {
                nombre,
                apellidos,
                email,
                password: hashedPassword,
                dieta,
                porciones,
                preferencias_adicionales
            },
        });

        res.status(201).json({
            message: "Registro exitoso",
            data: { id: nuevoUsuario.id }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error en el servidor", details: error.message });
    }
};

const getAllUsuarios = async (req, res) => {
    try {
        const listaUsuarios = await prisma.usuario.findMany({
            select: {
                id: true,
                nombre: true,
                apellidos: true,
                email: true,
                admin: true,
                activo: true,
                alergias: true,
                calorias: true,
                dieta: true,
                porciones: true,
                preferencias_adicionales: true,
                created_at: true,
                updated_at: true
            },
        });

        // Mapeo inline de cada usuario a etiquetas en inglés
        const usuariosTransformados = listaUsuarios.map(usuario => ({
            id: usuario.id,
            firstName: usuario.nombre,
            lastName: usuario.apellidos,
            email: usuario.email,
            admin: usuario.admin,
            active: usuario.activo,
            allergies: usuario.alergias,
            calories: usuario.calorias,
            diet: usuario.dieta,
            servings: usuario.porciones,
            additionalPreferences: usuario.preferencias_adicionales,
            createdAt: usuario.created_at,
            updatedAt: usuario.updated_at
        }));

        res.json({ message: "Usuarios obtenidos correctamente", data: usuariosTransformados });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al obtener usuarios", details: error.message });
    }
};

const getUsuario = async (req, res) => {
    try {
        const idUsuario = parseInt(req.params.id);

        const usuarioEncontrado = await prisma.usuario.findUnique({
            where: { id: idUsuario },
            select: {
                id: true,
                nombre: true,
                apellidos: true,
                email: true,
                admin: true,
                activo: true,
                alergias: true,
                calorias: true,
                dieta: true,
                porciones: true,
                preferencias_adicionales: true,
                created_at: true,
                updated_at: true
            },
        });

        if (!usuarioEncontrado) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }

        res.json({
            message: "Usuario obtenido correctamente",
            data: {
                id: usuarioEncontrado.id,
                firstName: usuarioEncontrado.nombre,
                lastName: usuarioEncontrado.apellidos,
                email: usuarioEncontrado.email,
                admin: usuarioEncontrado.admin,
                active: usuarioEncontrado.activo,
                allergies: usuarioEncontrado.alergias,
                calories: usuarioEncontrado.calorias,
                diet: usuarioEncontrado.dieta,
                servings: usuarioEncontrado.porciones,
                additionalPreferences: usuarioEncontrado.preferencias_adicionales,
                createdAt: usuarioEncontrado.created_at,
                updatedAt: usuarioEncontrado.updated_at
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error en el servidor", details: error.message });
    }
};

const updateUsuario = async (req, res) => {
    try {
        const idUsuario = parseInt(req.params.id);
        const {
            nombre,
            apellidos,
            email,
            password,
            alergias,
            calorias,
            dieta,
            porciones,
            preferencias_adicionales
        } = req.body;

        const datosActualizacion = {};

        if (nombre) datosActualizacion.nombre = nombre;
        if (apellidos) datosActualizacion.apellidos = apellidos;
        if (email) datosActualizacion.email = email;
        if (password) datosActualizacion.password = await bcrypt.hash(password, 10);
        if (alergias !== undefined) datosActualizacion.alergias = alergias;
        if (calorias !== undefined) datosActualizacion.calorias = calorias;
        if (dieta !== undefined) datosActualizacion.dieta = dieta;
        if (porciones !== undefined) datosActualizacion.porciones = porciones;
        if (preferencias_adicionales !== undefined) datosActualizacion.preferencias_adicionales = preferencias_adicionales;

        await prisma.usuario.update({
            where: { id: idUsuario },
            data: datosActualizacion,
        });

        res.json({ message: "Datos del perfil actualizados correctamente" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error en el servidor", details: error.message });
    }
};

const activarDesactivarUsuario = async (req, res) => {
    try {
        const idUsuario = parseInt(req.params.id);

        const usuarioExistente = await prisma.usuario.findUnique({ where: { id: idUsuario } });
        if (!usuarioExistente) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }

        const usuarioActualizado = await prisma.usuario.update({
            where: { id: idUsuario },
            data: { activo: !usuarioExistente.activo },
        });

        res.json({ message: `Usuario ${usuarioActualizado.activo ? "activado" : "desactivado"} correctamente` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error en el servidor", details: error.message });
    }
};

const activarDesactivarAdmin = async (req, res) => {
    try {
        const idUsuario = parseInt(req.params.id);

        const usuarioExistente = await prisma.usuario.findUnique({ where: { id: idUsuario } });
        if (!usuarioExistente) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }

        const usuarioActualizado = await prisma.usuario.update({
            where: { id: idUsuario },
            data: { admin: !usuarioExistente.admin },
        });

        res.json({ message: `Permisos de administrador ${usuarioActualizado.admin ? "activados" : "desactivados"} correctamente` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error en el servidor", details: error.message });
    }
};

module.exports = {
    login,
    registro,
    getAllUsuarios,
    getUsuario,
    updateUsuario,
    activarDesactivarUsuario,
    activarDesactivarAdmin
};