// src/routes/recetas.routes.js
const express = require("express");
const router = express.Router();
const recetasController = require("../controllers/recetas.controller");

router.get("/favoritas/:id", recetasController.getRecetasFavoritas);
router.get("/favorito/:id", recetasController.alternarFavorito);
router.get("/:receta_id", recetasController.getReceta);
router.get("/generarRecetaMock/:userPrompt", recetasController.generarRecetaMock);
router.get("/generarRecetaAI/:userPrompt", recetasController.generarRecetaAI);

module.exports = router;