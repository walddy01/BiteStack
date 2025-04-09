require("dotenv").config();
const app = require("../api/app"); // Importa la configuración de Express desde app.js
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});