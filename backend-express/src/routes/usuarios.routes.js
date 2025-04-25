const express = require("express");
const router = express.Router();
const usuariosController = require("../controllers/usuarios.controller");

router.post("/login", usuariosController.login);
router.post("/registro", usuariosController.registro);
router.get("/", usuariosController.getAllUsuarios);
router.get("/:id", usuariosController.getUsuario);
router.patch("/:id", usuariosController.updateUsuario);
router.get("/activar/:id", usuariosController.activarDesactivarUsuario);
router.get("/admin/:id", usuariosController.activarDesactivarAdmin);

module.exports = router;