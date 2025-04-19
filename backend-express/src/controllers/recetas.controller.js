// recetasController.js

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
function formatDate(date) {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// Schemas Zod para validar respuesta de IA
const IngredienteSchema = z.object({
  ingredient: z.string(),
  notes: z.string().optional(),
  amount: z.number(),
  unit: z.string(),
});

const RecetaSchema = z.object({
  title: z.string(),
  description: z.string(),
  number_of_servings: z.number(),
  difficulty: z.enum(["Fácil", "Media", "Difícil"]),
  prep_time: z.number(),
  ingredients: z.array(IngredienteSchema),
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
    const userId = parseInt(req.params.id, 10);

    const recetas = await prisma.receta.findMany({
      where: { usuario_id: userId, favorito: true },
      include: {
        recetaIngrediente: { include: { ingrediente: true } },
        programacionesMenu: { select: { fecha: true, tipo_comida: true } },
      },
    });

    const data = recetas.map(r => ({
      id: r.id,
      title: r.titulo,
      description: r.descripcion,
      number_of_servings: r.numero_raciones,
      difficulty: r.dificultad,
      prep_time: r.tiempo_prep,
      instructions: r.instrucciones,
      calories: r.calorias,
      protein: r.proteinas,
      carbohydrates: r.carbohidratos,
      fat: r.grasas,
      favorite: r.favorito,
      ingredients: r.recetaIngrediente.map(ri => ({
        id: ri.ingrediente.id,
        name: ri.ingrediente.nombre,
        quantity: ri.cantidad,
        unit: ri.unidad,
        note: ri.nota,
      })),
      schedules: r.programacionesMenu.map(pm => ({
        date: formatDate(pm.fecha),
        mealType: pm.tipo_comida,
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
    const recetaId = parseInt(req.params.id, 10);
    const receta = await prisma.receta.findUnique({ where: { id: recetaId } });
    if (!receta) {
      return res.status(404).json({ error: "Receta no encontrada" });
    }
    const updated = await prisma.receta.update({
      where: { id: recetaId },
      data: { favorito: !receta.favorito },
    });
    res.json({
      message: `Receta ${updated.favorito ? "marcada como favorita" : "desmarcada como favorita"}`,
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
    const recetaId = parseInt(req.params.receta_id, 10);

    const r = await prisma.receta.findUnique({
      where: { id: recetaId },
      include: {
        recetaIngrediente: { include: { ingrediente: true } },
        programacionesMenu: { select: { fecha: true, tipo_comida: true } },
      },
    });
    if (!r) {
      return res.status(404).json({ error: "Receta no encontrada" });
    }

    const data = {
      recipe: {
        id: r.id,
        title: r.titulo,
        description: r.descripcion,
        number_of_servings: r.numero_raciones,
        difficulty: r.dificultad,
        prep_time: r.tiempo_prep,
        instructions: r.instrucciones,
        calories: r.calorias,
        protein: r.proteinas,
        carbohydrates: r.carbohidratos,
        fat: r.grasas,
        favorite: r.favorito,
      },
      ingredients: r.recetaIngrediente.map(ri => ({
        id: ri.ingrediente.id,
        name: ri.ingrediente.nombre,
        quantity: ri.cantidad,
        unit: ri.unidad,
        note: ri.nota,
      })),
      schedules: r.programacionesMenu.map(pm => ({
        date: formatDate(pm.fecha),
        mealType: pm.tipo_comida,
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
    const mock = {
      title: "Receta Mockeada",
      description: "Esta es una receta de prueba generada automáticamente.",
      number_of_servings: 4,
      difficulty: "Fácil",
      prep_time: 30,
      ingredients: [
        { ingredient: "Ingrediente Mock 1", amount: 100, unit: "g", notes: "Nota 1" },
        { ingredient: "Ingrediente Mock 2", amount: 2,   unit: "l", notes: "Nota 2" },
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
    res.json(mock);
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
- title, description, number_of_servings, difficulty, prep_time
- ingredients: array con {ingredient, notes?, amount, unit (SI)}
- instructions: array de strings
- total_calories_per_serving, protein_per_serving, carbohydrates_per_serving, fat_per_serving
La receta debe estar en español y los field names en inglés.
    `;
    const completion = await openai.beta.chat.completions.parse({
      model: "gemini-2.0-flash-lite",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user",   content: userPrompt },
      ],
      response_format: zodResponseFormat(RecetaSchema, "receta"),
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
