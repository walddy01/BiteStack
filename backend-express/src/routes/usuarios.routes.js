const express = require("express");
const router = express.Router();
const usuariosController = require("../controllers/usuarios.controller");
const checkAuth = require("../../middleware/checkAuth.js");

router.post("/registro", usuariosController.registro);
router.get("/perfil", checkAuth, usuariosController.getPerfil);
router.patch("/perfil", checkAuth, usuariosController.updatePerfil);
router.get("/", checkAuth, usuariosController.getAllUsuarios);

module.exports = router;
