const express = require("express");
const router = express.Router();
const usuariosController = require("../controllers/usuarios.controller");
const checkAuth = require("../../middleware/checkAuth.js");

// Registro público
router.post("/registro", usuariosController.registro);

// Rutas protegidas (requieren Bearer token)
router.get("/perfil", checkAuth, usuariosController.getPerfil);
router.patch("/perfil", checkAuth, usuariosController.updatePerfil);

// (Opcional) Listar todos los usuarios (solo para pruebas/desarrollo)
router.get("/", checkAuth, usuariosController.getAllUsuarios);

module.exports = router;
