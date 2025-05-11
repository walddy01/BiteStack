const express = require("express");
const router = express.Router();
const recetasController = require("../controllers/recetas.controller");
const checkAuth = require("../../middleware/checkAuth.js");

router.get("/favoritas", checkAuth, recetasController.getRecetasFavoritas);
router.patch("/favorito/:id", checkAuth, recetasController.alternarFavorito);
router.get("/:receta_id", checkAuth, recetasController.getReceta);
router.post("/regenerar/:idReceta", checkAuth, recetasController.regenerarReceta);

module.exports = router;
