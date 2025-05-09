const express = require("express");
const router = express.Router();
const menusController = require("../controllers/menus.controller");
const checkAuth = require("../../middleware/checkAuth.js");

// Todas las rutas protegidas: el usuario se identifica por el token Bearer

// Obtener todos los menús del usuario autenticado
router.get("/", checkAuth, menusController.getMenusUsuario);

// Obtener el menú de la semana actual del usuario autenticado
router.get("/semana", checkAuth, menusController.getMenuSemanaUsuario);

// Obtener todas las listas de compra del usuario autenticado
router.get("/listascompra", checkAuth, menusController.getListasCompraUsuario);

// Alternar adquirido en una lista de compra (requiere id de lista y de ingrediente)
router.patch("/listascompra/adquirido/:idLista/:idIngrediente", checkAuth, menusController.alternarAdquirido);

// Generar menú para el usuario autenticado
router.post("/generar", checkAuth, menusController.generarMenu);

module.exports = router;
