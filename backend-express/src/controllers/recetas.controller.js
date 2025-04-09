// src/controllers/recetas.controller.js

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { zodResponseFormat } = require("openai/helpers/zod");
const { z } = require("zod");
const { OpenAI } = require("openai");

const openai = new OpenAI({
  apiKey: process.env.GEMINI_API_KEY,
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai",
});

/**
 * Obtiene las recetas favoritas del usuario.
 * Se filtra por usuario (usuario_id) y favorito = true.
 */
const getRecetasFavoritas = async (req, res) => {
  try {
    const userId = parseInt(req.params.id);

    const recetasFavoritas = await prisma.receta.findMany({
      where: {
        usuario_id: userId,
        favorito: true,
      },
    });

    const data = await Promise.all(
      recetasFavoritas.map(async (receta) => {
        const ingredientesReceta = await prisma.recetaIngrediente.findMany({
          where: { receta_id: receta.id },
          include: { ingrediente: true },
        });
        const ingredientes = ingredientesReceta.map((ri) => ({
          id: ri.ingrediente.id,
          nombre: ri.ingrediente.nombre,
          cantidad: ri.cantidad,
          unidad: ri.unidad,
          nota: ri.nota,
        }));

        return {
          id: receta.id,
          titulo: receta.titulo,
          descripcion: receta.descripcion,
          instrucciones: receta.instrucciones,
          calories: receta.calorias,
          protein: receta.proteinas,
          carbohydrates: receta.carbohidratos,
          fat: receta.grasas,
          favorito: receta.favorito,
          ingredientes,
        };
      })
    );
    res.json({ message: 'Recetas favoritas obtenidas correctamente', data });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Ocurrió un error al obtener las recetas favoritas",
      detalles: error.message,
    });
  }
};

/**
 * Alterna el estado "favorito" de una receta.
 */
const alternarFavorito = async (req, res) => {
  try {
    const recetaId = parseInt(req.params.id);

    const receta = await prisma.receta.findUnique({ where: { id: recetaId } });
    if (!receta) {
      return res.status(404).json({ error: "Receta no encontrada" });
    }

    const updatedReceta = await prisma.receta.update({
      where: { id: recetaId },
      data: { favorito: !receta.favorito },
    });

    res.json({ message: `Receta ${updatedReceta.favorito ? 'marcada como favorita' : 'desmarcada como favorita'}` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error en el servidor", detalles: error.message });
  }
};

/**
 * Obtiene una receta por su id, incluyendo sus ingredientes.
 */
const getReceta = async (req, res) => {
  try {
    const recetaId = parseInt(req.params.receta_id);

    const receta = await prisma.receta.findUnique({
      where: { id: recetaId },
    });
    if (!receta) {
      return res.status(404).json({ error: 'Receta no encontrada' });
    }

    const recetaIngredientes = await prisma.recetaIngrediente.findMany({
      where: { receta_id: receta.id },
      include: { ingrediente: true },
    });

    const ingredientes = recetaIngredientes.map((ri) => ({
      id: ri.ingrediente.id,
      nombre: ri.ingrediente.nombre,
      cantidad: ri.cantidad,
      unidad: ri.unidad,
      nota: ri.nota,
    }));

    const response = {
      receta: {
        id: receta.id,
        titulo: receta.titulo,
        descripcion: receta.descripcion,
        instrucciones: receta.instrucciones,
        calories: receta.calorias,
        protein: receta.proteinas,
        carbohydrates: receta.carbohidratos,
        fat: receta.grasas,
        favorito: receta.favorito,
      },
      ingredientes: ingredientes,
    };

    res.json({ message: 'Receta obtenida correctamente', data: response });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: 'Ocurrió un error al obtener la receta',
      detalles: error.message,
    });
  }
};

/**
 * Genera una receta mock para pruebas.
 * Se ajusta al nuevo formato:
 * - title, description, number_of_servings, difficulty, prep_time,
 * - ingredients (array de objetos), instructions (array de strings),
 * - calories, protein, carbohydrates, fat.
 */
const generarRecetaMock = async (req, res) => {
  try {
    const mockReceta = {
      title: "Receta Mockeada",
      description: "Esta es una receta de prueba generada automáticamente.",
      number_of_servings: 4,
      difficulty: "Fácil",
      prep_time: 30,
      ingredients: [
        {
          ingredient: "Ingrediente Mock 1",
          amount: 100,
          unit: "gr",
          notes: "Nota 1",
        },
        {
          ingredient: "Ingrediente Mock 2",
          amount: 2,
          unit: "gr", // Se recomienda usar unidades del SI
          notes: "Nota 2",
        },
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

    res.json(mockReceta);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al generar la receta", detalles: error.message });
  }
};

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
  calories: z.number(),
  protein: z.number(),
  carbohydrates: z.number(),
  fat: z.number(),
});

/**
 * Genera una receta usando la API de Gemini.
 * Se espera que el parámetro "userPrompt" se envíe en la URL.
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
            - **ingredient**: Name of the ingredient.  
            - **notes**: Additional details about the ingredient (optional).  
            - **amount**: Numeric value indicating the quantity.  
            - **unit**: **Use only units from the International System of Units (SI)** (grams, milliliters, liters). Do not use cups, ounces, or other imperial units.  
        - **instructions**: Array of step-by-step instructions.  
        - **total_calories_per_serving**: Calories per serving (total calories divided by number_of_servings).  
        - **protein_per_serving**: Grams of protein per serving.  
        - **carbohydrates_per_serving**: Grams of carbohydrates per serving.  
        - **fat_per_serving**: Grams of fat per serving.  

        ### Important Notes:  
        - The recipe **must be in Spanish**.  
        - **Field names MUST remain in English**, as specified above.  
        - Provide specific ingredient quantities and clear instructions.  
        - Ensure that **nutritional values are calculated per serving** (divide total by number_of_servings).  
        - **Use only International System of Units (SI) measurements**: grams (g), milliliters (ml), liters (l), and degrees Celsius (°C). Avoid cups, ounces, teaspoons, tablespoons, Fahrenheit, or any non-SI unit.  
        `;

    const completion = await openai.beta.chat.completions.parse({
      model: "gemini-2.0-flash-lite",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      response_format: zodResponseFormat(RecetaSchema, "receta"),
    });

    const receta = completion.choices[0].message.parsed;

    if (!receta) {
      return res.status(400).json({ error: "No se pudo generar la receta. La respuesta de la IA fue inválida." });
    }

    res.json(receta);
  } catch (error) {
    console.error(error);
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: "Error de validación de Zod", detalles: error.errors });
    } else if (error.code === 'not_found') {
      res.status(404).json({ error: "El modelo solicitado no fue encontrado.", detalles: error.message });
    } else if (error.status) {
      res.status(error.status).json({ error: "Error en la solicitud a la API de Gemini.", detalles: error.message, rawError: error });
    } else {
      res.status(500).json({ error: "Error al generar la receta", detalles: error.message });
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
