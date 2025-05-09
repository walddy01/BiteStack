const express = require("express");
const router = express.Router();
const recetasController = require("../controllers/recetas.controller");
const checkAuth = require("../../middleware/checkAuth.js");

// Todas las rutas protegidas: el usuario se identifica por el token Bearer

// Obtener recetas favoritas del usuario autenticado
router.get("/favoritas", checkAuth, recetasController.getRecetasFavoritas);

// Alternar favorito en una receta (requiere id de receta)
router.patch("/favorito/:id", checkAuth, recetasController.alternarFavorito);

// Obtener una receta por su id
router.get("/:receta_id", checkAuth, recetasController.getReceta);

// Generar receta mock (puedes dejarlo público si quieres)
router.get("/generarRecetaMock/:userPrompt", recetasController.generarRecetaMock);

// Generar receta AI (puedes dejarlo público si quieres)
router.get("/generarRecetaAI/:userPrompt", recetasController.generarRecetaAI);

module.exports = router;
