const express = require("express");
const router = express.Router();
const menusController = require("../controllers/menus.controller");
const checkAuth = require("../../middleware/checkAuth.js");

router.get("/", checkAuth, menusController.getMenusUsuario);
router.get("/semana", checkAuth, menusController.getMenuSemanaUsuario);
router.get("/listascompra", checkAuth, menusController.getListasCompraUsuario);
router.patch("/listascompra/adquirido/:idLista/:idIngrediente", checkAuth, menusController.alternarAdquirido);
router.post("/generar", checkAuth, menusController.generarMenu);
router.get("/:id", checkAuth, menusController.getMenu);

module.exports = router;
