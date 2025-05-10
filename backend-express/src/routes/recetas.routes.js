const express = require("express");
const router = express.Router();
const recetasController = require("../controllers/recetas.controller");
const checkAuth = require("../../middleware/checkAuth.js");

router.get("/favoritas", checkAuth, recetasController.getRecetasFavoritas);
router.patch("/favorito/:id", checkAuth, recetasController.alternarFavorito);
router.get("/:receta_id", checkAuth, recetasController.getReceta);
router.get("/generarRecetaMock/:userPrompt", recetasController.generarRecetaMock);
router.get("/generarRecetaAI/:userPrompt", recetasController.generarRecetaAI);

module.exports = router;
