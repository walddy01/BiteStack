const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { zodResponseFormat } = require("openai/helpers/zod");
const { z } = require("zod");
const { OpenAI } = require("openai");

const openai = new OpenAI({
  apiKey: process.env.GEMINI_API_KEY,
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai",
});

// Formatea Date a "YYYY-MM-DD"
function formatearFecha(fecha) {
  const d = new Date(fecha);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

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

// GET /recetas/favoritas
const getRecetasFavoritas = async (req, res) => {
  try {
    const idUsuario = req.user.id;

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

// PATCH /recetas/favorito/:id
const alternarFavorito = async (req, res) => {
  try {
    const idReceta = parseInt(req.params.id, 10);

    const receta = await prisma.receta.findFirst({
      where: { id: idReceta, usuario_id: req.user.id },
    });
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

// GET /recetas/:receta_id
const getReceta = async (req, res) => {
  try {
    const idReceta = parseInt(req.params.receta_id, 10);

    const recetaEncontrada = await prisma.receta.findFirst({
      where: { id: idReceta, usuario_id: req.user.id },
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

// POST /recetas/regenerar/:idReceta
const regenerarReceta = async (req, res) => {
  try {
    const { idReceta } = req.params;
    const { userPrompt } = req.body;
    const idUsuario = req.user.id;

    if (!userPrompt) {
      return res.status(400).json({ error: "El prompt de usuario es requerido." });
    }

    const recetaOriginal = await prisma.receta.findFirst({
      where: { id: parseInt(idReceta), usuario_id: idUsuario },
      include: {
        recetaIngrediente: { include: { ingrediente: true } },
      },
    });

    if (!recetaOriginal) {
      return res.status(404).json({ error: "Receta original no encontrada o no pertenece al usuario." });
    }

    const recetaOriginalFormateada = {
      title: recetaOriginal.titulo,
      description: recetaOriginal.descripcion,
      number_of_servings: recetaOriginal.numero_raciones,
      difficulty: recetaOriginal.dificultad,
      prep_time: recetaOriginal.tiempo_prep,
      ingredients: recetaOriginal.recetaIngrediente.map(ri => ({
        ingredient: ri.ingrediente.nombre,
        amount: parseFloat(ri.cantidad), 
        unit: ri.unidad,
        notes: ri.nota || undefined,
      })),
      instructions: recetaOriginal.instrucciones.split('\n'),
    };

    const systemPrompt = `
    You are an expert chef AI. Your task is to **modify an existing recipe** based on user instructions.
    The user will provide the original recipe (as context) and a prompt with the desired changes.
    Respond with the **complete, modified recipe in JSON format**.

    The JSON structure for the recipe is:
    - **title**: Short and concise recipe title.
    - **description**: Brief summary of the recipe.
    - **number_of_servings**: Number of people the recipe serves.
    - **difficulty**: Difficulty level of the recipe (e.g., Fácil, Media, Difícil).
    - **prep_time**: Preparation time in minutes.
    - **ingredients**: Array of ingredients, each with:
        - **ingredient**: Name of the ingredient. Must start with capital letter (e.g., "Arroz", "Leche", "Tomate").
        - **notes**: Additional details about the ingredient (optional).
        - **amount**: Numeric value indicating the quantity.
        - **unit**: Unit of measurement (e.g., "g", "ml", "l").
    - **instructions**: Array of step-by-step instructions.
    - **total_calories_per_serving**: Calories per serving (total calories divided by number_of_servings).
    - **protein_per_serving**: Grams of protein per serving.
    - **carbohydrates_per_serving**: Grams of carbohydrates per serving.
    - **fat_per_serving**: Grams of fat per serving.

    ### Important Notes & Modification Guidelines:
    - **Context is Key**: Use the provided original recipe as the primary context for modifications. If the user asks for a small change, modify that part but keep the rest of the recipe consistent unless specified otherwise. If the user asks for a major change (e.g., "make it vegan"), adapt all necessary parts of the original recipe.
    - **Return Complete Recipe**: Always return the *entire modified recipe object*, not just the changed parts.
    - **Language**: The entire recipe (titles, descriptions, ingredients, instructions, notes) MUST be in Spanish.
    - **Field Names**: JSON field names MUST remain in English, as specified above.
    - **Ingredient Names**: MUST start with a capital letter to maintain consistency.
    - **Ingredient Notes**: Use the "notes" field for an ingredient only when it's genuinely necessary for clarification (e.g., "Tomatoes, ripe", "Milk, preferably whole"). Avoid using "notes" for trivial details that are obvious or don't significantly impact the recipe.
    - **SI Units**: **Use only International System of Units (SI) measurements**: grams (g), milliliters (ml), liters (l), and degrees Celsius (°C). Avoid cups, ounces, teaspoons, tablespoons, Fahrenheit, or any non-SI unit. This applies to any new or modified ingredients.
    - **Nutritional Values**: Ensure nutritional values are per serving. If the number_of_servings changes due to the modification, recalculate these values accordingly.
    - **Clarity**: Provide specific ingredient quantities and clear instructions in the modified recipe.
    - **Interpretation**: If the user's modification prompt is unclear or contradictory, try your best to interpret it reasonably or maintain the original aspect for that part if modification is not feasible.
    `;

    const completion = await openai.beta.chat.completions.parse({
      model: "gemini-2.0-flash-lite",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Receta original: ${JSON.stringify(recetaOriginalFormateada)}` },
        { role: "user", content: `Instrucciones de modificación: ${userPrompt}` },
      ],
      response_format: zodResponseFormat(SchemaReceta, "receta"),
    });

    const recetaRegeneradaIA = completion.choices[0].message.parsed;

    if (!recetaRegeneradaIA) {
      return res.status(500).json({ error: "Respuesta inválida de la IA al regenerar la receta." });
    }

    const recetaActualizada = await prisma.$transaction(async (tx) => {
      const updatedReceta = await tx.receta.update({
        where: { id: recetaOriginal.id },
        data: {
          titulo: recetaRegeneradaIA.title,
          descripcion: recetaRegeneradaIA.description,
          numero_raciones: recetaRegeneradaIA.number_of_servings,
          dificultad: recetaRegeneradaIA.difficulty,
          tiempo_prep: recetaRegeneradaIA.prep_time,
          instrucciones: recetaRegeneradaIA.instructions.join("\n"),
          calorias: Math.round(recetaRegeneradaIA.total_calories_per_serving * recetaRegeneradaIA.number_of_servings),
          proteinas: Math.round(recetaRegeneradaIA.protein_per_serving * recetaRegeneradaIA.number_of_servings),
          carbohidratos: Math.round(recetaRegeneradaIA.carbohydrates_per_serving * recetaRegeneradaIA.number_of_servings),
          grasas: Math.round(recetaRegeneradaIA.fat_per_serving * recetaRegeneradaIA.number_of_servings),
        },
      });

      await tx.recetaIngrediente.deleteMany({
        where: { receta_id: recetaOriginal.id },
      });

      const mapaIngredientesUnicos = new Map();
      recetaRegeneradaIA.ingredients.forEach(ing => {
        if (!mapaIngredientesUnicos.has(ing.ingredient)) {
          mapaIngredientesUnicos.set(ing.ingredient, ing);
        }
      });

      if (mapaIngredientesUnicos.size > 0) {
        await tx.ingrediente.createMany({
          data: [...mapaIngredientesUnicos.values()].map(ing => ({ nombre: ing.ingredient })),
          skipDuplicates: true,
        });
      }

      const nombresIngredientesNuevos = [...mapaIngredientesUnicos.keys()];
      const ingredientesEnDB = await tx.ingrediente.findMany({
        where: { nombre: { in: nombresIngredientesNuevos } },
        select: { id: true, nombre: true },
      });
      const mapaIdsIngredientes = new Map(ingredientesEnDB.map(ing => [ing.nombre, ing.id]));

      const nuevasRelacionesIngredientes = recetaRegeneradaIA.ingredients
        .map(ing => {
          const idIng = mapaIdsIngredientes.get(ing.ingredient);
          if (idIng) {
            return {
              receta_id: recetaOriginal.id,
              ingrediente_id: idIng,
              cantidad: ing.amount.toString(),
              unidad: ing.unit, // Asegurar que unidad siempre sea un string
              nota: ing.notes || "",
            };
          }
          return null;
        })
        .filter(rel => rel !== null);

      if (nuevasRelacionesIngredientes.length > 0) {
        await tx.recetaIngrediente.createMany({
          data: nuevasRelacionesIngredientes,
        });
      }
      return updatedReceta;
    });

    const recetaFinalCompleta = await prisma.receta.findUnique({
        where: { id: recetaActualizada.id },
        include: {
            recetaIngrediente: { include: { ingrediente: true } },
            programacionesMenu: { select: { fecha: true, tipo_comida: true } },
        }
    });

     const data = {
      recipe: {
        id: recetaFinalCompleta.id,
        title: recetaFinalCompleta.titulo,
        description: recetaFinalCompleta.descripcion,
        number_of_servings: recetaFinalCompleta.numero_raciones,
        difficulty: recetaFinalCompleta.dificultad,
        prep_time: recetaFinalCompleta.tiempo_prep,
        instructions: recetaFinalCompleta.instrucciones, // Coincide con getReceta (string)
        calories: recetaFinalCompleta.calorias,
        protein: recetaFinalCompleta.proteinas,
        carbohydrates: recetaFinalCompleta.carbohidratos,
        fat: recetaFinalCompleta.grasas,
        favorite: recetaFinalCompleta.favorito,
        // Campos por porción eliminados para coincidir con getReceta
      },
      ingredients: recetaFinalCompleta.recetaIngrediente.map(recetaIng => ({
        id: recetaIng.ingrediente.id,
        name: recetaIng.ingrediente.nombre,
        quantity: recetaIng.cantidad, // Coincide con getReceta (string)
        unit: recetaIng.unidad,
        note: recetaIng.nota,
      })),
      schedules: recetaFinalCompleta.programacionesMenu.map(progMenu => ({
        date: formatearFecha(progMenu.fecha),
        mealType: progMenu.tipo_comida,
      })),
    };

    res.json({ message: "Receta regenerada correctamente.", data });

  } catch (error) {
    console.error("Error al regenerar receta:", error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: "Error de validación de la IA", details: error.errors });
    }
    res.status(500).json({ error: "Error en el servidor al regenerar la receta.", details: error.message });
  }
};

module.exports = {
  getRecetasFavoritas,
  alternarFavorito,
  getReceta,
  regenerarReceta,
};
