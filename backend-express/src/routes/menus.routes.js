// src/routes/menus.routes.js
const express = require("express");
const router = express.Router();
const menusController = require("../controllers/menus.controller");

router.get("/:id", menusController.getMenusUsuario); // Obtener menús
router.get("/listascompra/:id", menusController.getListasCompraUsuario); // Obtener listas de compra
router.get("/listascompra/adquirido/:idLista/:idIngrediente", menusController.alternarAdquirido);
router.post("/generarMenu/:id", menusController.generarMenu); // Generar menú (mock)


module.exports = router;