// src/routes/menus.routes.js
const express = require("express");
const router = express.Router();
const menusController = require("../controllers/menus.controller");

router.get("/:id", menusController.getMenusUsuario);
router.get("/menuSemana/:id", menusController.getMenuSemanaUsuario);
router.get("/listascompra/:id", menusController.getListasCompraUsuario);
router.get("/listascompra/adquirido/:idLista/:idIngrediente", menusController.alternarAdquirido);
router.post("/generarMenu/:id", menusController.generarMenu);

module.exports = router;