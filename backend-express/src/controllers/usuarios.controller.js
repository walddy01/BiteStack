const { PrismaClient } = require("@prisma/client");
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "Email y contraseña son requeridos" });
        }

        const user = await prisma.usuario.findUnique({ where: { email } });

        if (!user) {
            return res.status(401).json({ error: "Credenciales inválidas" });
        }

        if (!user.activo) {
            return res.status(401).json({ error: 'La cuenta está desactivada.' });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({ error: "Credenciales inválidas" });
        }

        // Mapeo de los campos del usuario a etiquetas en inglés
        res.json({
            message: "Inicio de sesión exitoso",
            data: {
                id: user.id,
                firstName: user.nombre,
                lastName: user.apellidos,
                email: user.email,
                admin: user.admin,
                active: user.activo,
                allergies: user.alergias,
                calories: user.calorias,
                diet: user.dieta,
                servings: user.porciones,
                additionalPreferences: user.preferencias_adicionales,
                createdAt: user.created_at,
                updatedAt: user.updated_at
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

        const existingUser = await prisma.usuario.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(409).json({ error: "El email ya está registrado" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await prisma.usuario.create({
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
            data: { id: newUser.id }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error en el servidor", details: error.message });
    }
};

const getAllUsuarios = async (req, res) => {
    try {
        const usuarios = await prisma.usuario.findMany({
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
        const usersTransformed = usuarios.map(user => ({
            id: user.id,
            firstName: user.nombre,
            lastName: user.apellidos,
            email: user.email,
            admin: user.admin,
            active: user.activo,
            allergies: user.alergias,
            calories: user.calorias,
            diet: user.dieta,
            servings: user.porciones,
            additionalPreferences: user.preferencias_adicionales,
            createdAt: user.created_at,
            updatedAt: user.updated_at
        }));

        res.json({ message: "Usuarios obtenidos correctamente", data: usersTransformed });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al obtener usuarios", details: error.message });
    }
};

const getUsuario = async (req, res) => {
    try {
        const userId = parseInt(req.params.id);

        const user = await prisma.usuario.findUnique({
            where: { id: userId },
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

        if (!user) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }

        res.json({
            message: "Usuario obtenido correctamente",
            data: {
                id: user.id,
                firstName: user.nombre,
                lastName: user.apellidos,
                email: user.email,
                admin: user.admin,
                active: user.activo,
                allergies: user.alergias,
                calories: user.calorias,
                diet: user.dieta,
                servings: user.porciones,
                additionalPreferences: user.preferencias_adicionales,
                createdAt: user.created_at,
                updatedAt: user.updated_at
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error en el servidor", details: error.message });
    }
};

const updateUsuario = async (req, res) => {
    try {
        const userId = parseInt(req.params.id);
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

        const updateData = {};

        if (nombre) updateData.nombre = nombre;
        if (apellidos) updateData.apellidos = apellidos;
        if (email) updateData.email = email;
        if (password) updateData.password = await bcrypt.hash(password, 10);
        if (alergias !== undefined) updateData.alergias = alergias;
        if (calorias !== undefined) updateData.calorias = calorias;
        if (dieta !== undefined) updateData.dieta = dieta;
        if (porciones !== undefined) updateData.porciones = porciones;
        if (preferencias_adicionales !== undefined) updateData.preferencias_adicionales = preferencias_adicionales;

        await prisma.usuario.update({
            where: { id: userId },
            data: updateData,
        });

        res.json({ message: "Datos del perfil actualizados correctamente" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error en el servidor", details: error.message });
    }
};

const activarDesactivarUsuario = async (req, res) => {
    try {
        const userId = parseInt(req.params.id);

        const user = await prisma.usuario.findUnique({ where: { id: userId } });
        if (!user) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }

        const updatedUser = await prisma.usuario.update({
            where: { id: userId },
            data: { activo: !user.activo },
        });

        res.json({ message: `Usuario ${updatedUser.activo ? "activado" : "desactivado"} correctamente` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error en el servidor", details: error.message });
    }
};

const activarDesactivarAdmin = async (req, res) => {
    try {
        const userId = parseInt(req.params.id);

        const user = await prisma.usuario.findUnique({ where: { id: userId } });
        if (!user) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }

        const updatedUser = await prisma.usuario.update({
            where: { id: userId },
            data: { admin: !user.admin },
        });

        res.json({ message: `Permisos de administrador ${updatedUser.admin ? "activados" : "desactivados"} correctamente` });
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
