// src/app.js
const express = require("express");
const cors = require("cors");
const usuariosRoutes = require("../src/routes/usuarios.routes");
const recetasRoutes = require("../src/routes/recetas.routes");
const menusRoutes = require("../src/routes/menus.routes");


const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

app.use("/rata", (req, res) => {
  res.redirect("https://media.tenor.com/GgLwolFoG0sAAAAM/rat-dance.gif");
});

// Rutas.  Anteponemos /api/ para indicar que es una API REST
app.use("/api/usuarios", usuariosRoutes);
app.use("/api/recetas", recetasRoutes);
app.use("/api/menus", menusRoutes);


// Manejador de errores genérico (opcional pero MUY recomendado)
app.use((err, req, res, next) => {
  console.error(err.stack); // Imprime el error completo en la consola
  res.status(500).send({ error: 'Algo salió mal!', detalles: err.message });
});


module.exports = app;