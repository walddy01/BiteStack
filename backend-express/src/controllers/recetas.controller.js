const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { zodResponseFormat } = require("openai/helpers/zod");
const { z } = require("zod");
const { OpenAI } = require("openai");

const openai = new OpenAI({
  apiKey: process.env.GEMINI_API_KEY,
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai",
});

/** Formatea un Date a "YYYY-MM-DD" */
function formatearFecha(fecha) {
  const d = new Date(fecha);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// Schemas Zod para validar respuesta de IA
const SchemaIngrediente = z.object({
  ingredient: z.string(),
  notes: z.string().optional(),
  amount: z.number(),
  unit: z.string(),
});

const SchemaReceta = z.object({
  title: z.string(),
  description: z.string(),
  number_of_servings: z.number(),
  difficulty: z.enum(["Fácil", "Media", "Difícil"]),
  prep_time: z.number(),
  ingredients: z.array(SchemaIngrediente),
  instructions: z.array(z.string()),
  total_calories_per_serving: z.number(),
  protein_per_serving: z.number(),
  carbohydrates_per_serving: z.number(),
  fat_per_serving: z.number(),
});

/**
 * GET /recetas/favoritas/:id
 * Obtiene las recetas favoritas de un usuario,
 * e incluye sus ingredientes y programaciones (fecha + tipo_comida).
 */
const getRecetasFavoritas = async (req, res) => {
  try {
    const idUsuario = parseInt(req.params.id, 10);

    const recetas = await prisma.receta.findMany({
      where: { usuario_id: idUsuario, favorito: true },
      include: {
        recetaIngrediente: { include: { ingrediente: true } },
        programacionesMenu: { select: { fecha: true, tipo_comida: true } },
      },
    });

    const data = recetas.map(receta => ({
      id: receta.id,
      title: receta.titulo,
      description: receta.descripcion,
      number_of_servings: receta.numero_raciones,
      difficulty: receta.dificultad,
      prep_time: receta.tiempo_prep,
      instructions: receta.instrucciones,
      calories: receta.calorias,
      protein: receta.proteinas,
      carbohydrates: receta.carbohidratos,
      fat: receta.grasas,
      favorite: receta.favorito,
      ingredients: receta.recetaIngrediente.map(recetaIng => ({
        id: recetaIng.ingrediente.id,
        name: recetaIng.ingrediente.nombre,
        quantity: recetaIng.cantidad,
        unit: recetaIng.unidad,
        note: recetaIng.nota,
      })),
      schedules: receta.programacionesMenu.map(progMenu => ({
        date: formatearFecha(progMenu.fecha),
        mealType: progMenu.tipo_comida,
      })),
    }));

    res.json({ message: "Recetas favoritas obtenidas correctamente", data });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Ocurrió un error al obtener las recetas favoritas",
      details: error.message,
    });
  }
};

/**
 * PATCH /recetas/favorito/:id
 * Alterna el estado "favorito" de una receta dada su ID.
 */
const alternarFavorito = async (req, res) => {
  try {
    const idReceta = parseInt(req.params.id, 10);
    const receta = await prisma.receta.findUnique({ where: { id: idReceta } });
    if (!receta) {
      return res.status(404).json({ error: "Receta no encontrada" });
    }
    const actualizada = await prisma.receta.update({
      where: { id: idReceta },
      data: { favorito: !receta.favorito },
    });
    res.json({
      message: `Receta ${actualizada.favorito ? "marcada como favorita" : "desmarcada como favorita"}`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al alternar favorito", details: error.message });
  }
};

/**
 * GET /receta/:receta_id
 * Obtiene una receta por su ID, incluyendo ingredientes y programaciones.
 */
const getReceta = async (req, res) => {
  try {
    const idReceta = parseInt(req.params.receta_id, 10);

    const recetaEncontrada = await prisma.receta.findUnique({
      where: { id: idReceta },
      include: {
        recetaIngrediente: { include: { ingrediente: true } },
        programacionesMenu: { select: { fecha: true, tipo_comida: true } },
      },
    });
    if (!recetaEncontrada) {
      return res.status(404).json({ error: "Receta no encontrada" });
    }

    const data = {
      recipe: {
        id: recetaEncontrada.id,
        title: recetaEncontrada.titulo,
        description: recetaEncontrada.descripcion,
        number_of_servings: recetaEncontrada.numero_raciones,
        difficulty: recetaEncontrada.dificultad,
        prep_time: recetaEncontrada.tiempo_prep,
        instructions: recetaEncontrada.instrucciones,
        calories: recetaEncontrada.calorias,
        protein: recetaEncontrada.proteinas,
        carbohydrates: recetaEncontrada.carbohidratos,
        fat: recetaEncontrada.grasas,
        favorite: recetaEncontrada.favorito,
      },
      ingredients: recetaEncontrada.recetaIngrediente.map(recetaIng => ({
        id: recetaIng.ingrediente.id,
        name: recetaIng.ingrediente.nombre,
        quantity: recetaIng.cantidad,
        unit: recetaIng.unidad,
        note: recetaIng.nota,
      })),
      schedules: recetaEncontrada.programacionesMenu.map(progMenu => ({
        date: formatearFecha(progMenu.fecha),
        mealType: progMenu.tipo_comida,
      })),
    };

    res.json({ message: "Receta obtenida correctamente", data });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Ocurrió un error al obtener la receta",
      details: error.message,
    });
  }
};

/**
 * GET /receta/mock
 * Genera una receta de prueba en el formato esperado.
 */
const generarRecetaMock = async (req, res) => {
  try {
    const recetaMock = {
      title: "Receta Mockeada",
      description: "Esta es una receta de prueba generada automáticamente.",
      number_of_servings: 4,
      difficulty: "Fácil",
      prep_time: 30,
      ingredients: [
        { ingredient: "Harina", amount: 100, unit: "g", notes: "Nota 1" },
        { ingredient: "Leche", amount: 2,   unit: "l", notes: "Nota 2" },
      ],
      instructions: [
        "Paso 1: Mezclar los ingredientes.",
        "Paso 2: Hornear a 180°C durante 30 minutos.",
      ],
      calories: 500,
      protein: 25,
      carbohydrates: 60,
      fat: 20,
    };
    res.json(recetaMock);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al generar la receta mock", details: error.message });
  }
};

/**
 * POST /receta/ai/:userPrompt
 * Genera una receta usando la API de Gemini, con validación Zod.
 */
const generarRecetaAI = async (req, res) => {
  try {
    const { userPrompt } = req.params;
    const systemPrompt = `
    Generate a recipe in JSON format with the following structure:
    - **title**: Short and concise recipe title.
    - **description**: Brief summary of the recipe.
    - **number_of_servings**: Number of people the recipe serves.
    - **difficulty**: Difficulty level of the recipe (e.g., Fácil, Media, Difícil).
    - **prep_time**: Preparation time in minutes.
    - **ingredients**: Array of ingredients, each with:
        - **ingredient**: Name of the ingredient. Must start with capital letter (e.g., "Arroz", "Leche", "Tomate").
        - **notes**: Additional details about the ingredient (optional).
        - **amount**: Numeric value indicating the quantity.
        - **unit**: **Use only units from the International System of Units (SI)** (grams, milliliters, liters).
    - **instructions**: Array of step-by-step instructions.
    - **total_calories_per_serving**: Calories per serving (total calories divided by number_of_servings).
    - **protein_per_serving**: Grams of protein per serving.
    - **carbohydrates_per_serving**: Grams of carbohydrates per serving.
    - **fat_per_serving**: Grams of fat per serving.

    ### Important Notes:
    - The recipe **must be in Spanish**.
    - **Field names MUST remain in English**, as specified above.
    - **Ingredient names MUST start with capital letter** to maintain consistency.
    - Provide specific ingredient quantities and clear instructions.
    - Ensure that **nutritional values are calculated per serving** (divide total by number_of_servings).
    - **Use only International System of Units (SI) measurements**: grams (g), milliliters (ml), liters (l), and degrees Celsius (°C). Avoid cups, ounces, teaspoons, tablespoons, Fahrenheit, or any non-SI unit.
    `;
    const completion = await openai.beta.chat.completions.parse({
      model: "gemini-2.0-flash-lite",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user",   content: userPrompt },
      ],
      response_format: zodResponseFormat(SchemaReceta, "receta"),
    });
    const receta = completion.choices[0].message.parsed;
    if (!receta) {
      return res.status(400).json({ error: "Respuesta de IA inválida" });
    }
    res.json(receta);
  } catch (error) {
    console.error(error);
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: "Error de validación", details: error.errors });
    } else {
      res.status(500).json({ error: "Error al generar la receta AI", details: error.message });
    }
  }
};

module.exports = {
  getRecetasFavoritas,
  alternarFavorito,
  getReceta,
  generarRecetaMock,
  generarRecetaAI,
};