// src/controllers/menus.controller.js

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { zodResponseFormat } = require("openai/helpers/zod");
const { z } = require("zod");
const { OpenAI } = require("openai");

const openai = new OpenAI({
  apiKey: process.env.GEMINI_API_KEY,
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai",
});

function getStartOfWeek(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // La semana inicia el lunes
  return new Date(d.setDate(diff));
}

function formatDate(date) {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

const getMenusUsuario = async (req, res) => {
  try {
    const userId = parseInt(req.params.id);

    const menus = await prisma.menu.findMany({
      where: { usuario_id: userId },
      orderBy: { created_at: "desc" },
      include: {
        recetasProgramadas: {
          include: {
            receta: { select: { id: true, titulo: true, descripcion: true, favorito: true } },
          },
        },
      },
    });

    if (menus.length === 0) {
      return res.status(200).json({
        message: "No se encontraron menús para el usuario especificado",
        data: [],
      });
    }

    const data = menus.map((menu) => ({
      menu_id: menu.id,
      menu_fecha: formatDate(menu.fecha_inicio_semana),
      recetas: menu.recetasProgramadas.map((rp) => rp.receta),
    }));

    res.json({ message: "Menús obtenidos correctamente", data });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Ocurrió un error al obtener los menús",
      detalles: error.message,
    });
  }
};

const getListasCompraUsuario = async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const menus = await prisma.menu.findMany({
      where: { usuario_id: userId },
      orderBy: { created_at: "desc" },
    });

    if (menus.length === 0) {
      return res.status(200).json({
        message: "No se encontraron menús para el usuario especificado",
        data: [],
      });
    }

    const data = await Promise.all(
      menus.map(async (menu) => {
        const listasCompra = await prisma.listaCompra.findMany({
          where: { menu_id: menu.id },
        });

        return Promise.all(
          listasCompra.map(async (lista) => {
            const ingredientesLista = await prisma.ingredienteListaCompra.findMany({
              where: { lista_compra_id: lista.id },
              include: { ingrediente: true },
            });

            const productosData = await Promise.all(
              ingredientesLista.map(async (producto) => {
                const recetaIngrediente = await prisma.recetaIngrediente.findFirst({
                  where: { ingrediente_id: producto.ingrediente_id },
                });

                return {
                  ingrediente_id: producto.ingrediente_id,
                  nombre: producto.ingrediente.nombre,
                  cantidad: recetaIngrediente ? recetaIngrediente.cantidad : "Desconocida",
                  unidad: recetaIngrediente ? recetaIngrediente.unidad : "Desconocida",
                  notas: recetaIngrediente ? recetaIngrediente.nota : "",
                  adquirido: producto.adquirido,
                };
              })
            );

            return {
              lista_compra_id: lista.id,
              fecha: formatDate(menu.fecha_inicio_semana),
              ingredientes: productosData,
            };
          })
        );
      })
    );

    const flattenedData = data.flat();
    res.json({ message: "Listas de compra obtenidas correctamente", data: flattenedData });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Ocurrió un error al obtener las listas de compra",
      detalles: error.message,
    });
  }
};

const alternarAdquirido = async (req, res) => {
  try {
    const idLista = parseInt(req.params.idLista);
    const idIngrediente = parseInt(req.params.idIngrediente);

    const listaIngrediente = await prisma.ingredienteListaCompra.findFirst({
      where: {
        lista_compra_id: idLista,
        ingrediente_id: idIngrediente,
      },
    });

    if (!listaIngrediente) {
      return res.status(404).json({ error: "Ingrediente en la lista no encontrado" });
    }

    const updatedListaIngrediente = await prisma.ingredienteListaCompra.update({
      where: { id: listaIngrediente.id },
      data: { adquirido: !listaIngrediente.adquirido },
    });

    res.json({
      message: `Ingrediente ${updatedListaIngrediente.adquirido ? "marcado como adquirido" : "desmarcado como adquirido"}`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Ocurrió un error al alternar el estado de adquirido",
      detalles: error.message,
    });
  }
};

const IngredienteSchema = z.object({
  ingredient: z.string(),
  notes: z.string().optional(), // Opcional
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

const generarRecetaAI = async (prompt) => {
  try {
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
            - **unit**: **Use only units from the International System of Units (SI)** (grams, milliliters, liters).  
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
        { role: "user", content: prompt },
      ],
      response_format: zodResponseFormat(RecetaSchema, "receta"),
    });

    return completion.choices[0].message.parsed;
  } catch (error) {
    console.error("Error generando receta con IA:", error);
    throw new Error("Error en la generación de receta");
  }
};

/**
 * Función para generar el menú. Se adapta para que el usuario pueda solicitar
 * la generación de uno, dos o tres tipos de comida (por ejemplo, Desayuno, Almuerzo, Cena)
 * para cada día de la semana.
 *
 * Se espera que el request incluya, opcionalmente, un arreglo "mealTypes" en el body.
 * Si no se proporciona, se asumen los tres tipos.
 *
 * Además, se consulta la información adicional del usuario para incluir:
 * "dieta", "calorías", "alergias", "porciones" y "preferencias_adicionales"
 * en el prompt de generación de recetas.
 */
const generarMenu = async (req, res) => {
  const userId = parseInt(req.params.id);
  const selectedMealTypes =
    Array.isArray(req.body.mealTypes) && req.body.mealTypes.length > 0
      ? req.body.mealTypes
      : ["Desayuno", "Almuerzo", "Cena"];

  try {
    // Obtener información adicional del usuario
    const usuario = await prisma.usuario.findUnique({
      where: { id: userId },
      select: {
        dieta: true,
        calorias: true,
        alergias: true,
        porciones: true,
        preferencias_adicionales: true,
      },
    });

    if (!usuario) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const today = new Date();
    const startOfWeek = getStartOfWeek(today);
    const formattedStartOfWeek = formatDate(startOfWeek);
    const startOfWeekDate = new Date(formattedStartOfWeek);

    // Verificar si ya existe un menú para la semana
    const existingMenus = await prisma.menu.findMany({
      where: {
        usuario_id: userId,
        fecha_inicio_semana: startOfWeekDate,
      },
    });

    if (existingMenus.length > 0) {
      return res.status(409).json({ error: "Ya existe un menú para esta semana." });
    }

    // 1. Crear un arreglo de prompts por día y por cada tipo de comida solicitado,
    //    incluyendo la información adicional del usuario.
    const prompts = [];
    for (let day = 0; day < 7; day++) {
      selectedMealTypes.forEach((meal) => {
        let prompt = `Genera una receta saludable para ${meal} del día ${day + 1}.`;
        if (usuario.dieta) prompt += ` Dieta: ${usuario.dieta}.`;
        if (usuario.calorias) prompt += ` Calorías deseadas: ${usuario.calorias}.`;
        if (usuario.alergias) prompt += ` Alergias: ${usuario.alergias}.`;
        if (usuario.porciones) prompt += ` Porciones: ${usuario.porciones}.`;
        if (usuario.preferencias_adicionales) prompt += ` Preferencias adicionales: ${usuario.preferencias_adicionales}.`;
        prompts.push(prompt);
      });
    }

    // Generar recetas con IA (en paralelo)
    const recetasGeneradas = await Promise.all(prompts.map(generarRecetaAI));

    // Iniciar transacción
    await prisma.$transaction(async (prisma) => {
      // Crear el menú
      const newMenu = await prisma.menu.create({
        data: {
          usuario_id: userId,
          fecha_inicio_semana: startOfWeekDate,
        },
      });

      // Crear la lista de compra asociada
      const newList = await prisma.listaCompra.create({
        data: { menu_id: newMenu.id },
      });

      // Array para almacenar las recetas creadas
      const recetasCreadas = [];

      // 2. Insertar cada receta y relacionarla en MenuRecetaDia.
      // Se usa un bucle for para asegurar el orden y esperar cada inserción.
      for (let index = 0; index < recetasGeneradas.length; index++) {
        const receta = recetasGeneradas[index];
        // Calcular el día: índice de día = floor(index / número de tipos seleccionados)
        const dayIndex = Math.floor(index / selectedMealTypes.length);
        // Obtener el tipo de comida según el orden en el arreglo seleccionado
        const mealIndex = index % selectedMealTypes.length;
        const tipo_comida = selectedMealTypes[mealIndex];

        const recetaCreada = await prisma.receta.create({
          data: {
            titulo: receta.title,
            descripcion: receta.description,
            numero_raciones: receta.number_of_servings,
            dificultad: receta.difficulty,
            instrucciones: receta.instructions.join("\n"),
            calorias: receta.calories,
            proteinas: receta.protein,
            carbohidratos: receta.carbohydrates,
            grasas: receta.fat,
            favorito: false,
            usuario_id: userId,
          },
        });
        recetasCreadas.push(recetaCreada);

        // Calcular la fecha para este día
        const fechaReceta = new Date(startOfWeekDate);
        fechaReceta.setDate(fechaReceta.getDate() + dayIndex);

        // Crear la relación en MenuRecetaDia
        await prisma.menuRecetaDia.create({
          data: {
            menu_id: newMenu.id,
            receta_id: recetaCreada.id,
            fecha: fechaReceta,
            tipo_comida: tipo_comida,
          },
        });
      }

      // 3. Preparar ingredientes únicos de todas las recetas
      const ingredientesUnicos = new Map();
      recetasGeneradas.forEach((receta) => {
        receta.ingredients.forEach((ing) => {
          if (!ingredientesUnicos.has(ing.ingredient)) {
            ingredientesUnicos.set(ing.ingredient, ing);
          }
        });
      });

      // Insertar ingredientes en bloque
      await prisma.ingrediente.createMany({
        data: [...ingredientesUnicos.values()].map((ing) => ({ nombre: ing.ingredient })),
        skipDuplicates: true,
      });

      // Obtener IDs de ingredientes desde la BD
      const ingredientesDB = await prisma.ingrediente.findMany({
        where: { nombre: { in: [...ingredientesUnicos.keys()] } },
        select: { id: true, nombre: true },
      });

      const ingredientesMap = new Map(ingredientesDB.map((ing) => [ing.nombre, ing.id]));

      // 4. Insertar relaciones receta-ingrediente
      const relacionesRecetaIngrediente = [];
      recetasGeneradas.forEach((receta, index) => {
        receta.ingredients.forEach((ing) => {
          relacionesRecetaIngrediente.push({
            receta_id: recetasCreadas[index].id,
            ingrediente_id: ingredientesMap.get(ing.ingredient),
            cantidad: ing.amount.toString(),
            unidad: ing.unit,
            nota: ing.notes,
          });
        });
      });

      if (relacionesRecetaIngrediente.length > 0) {
        await prisma.recetaIngrediente.createMany({
          data: relacionesRecetaIngrediente,
          skipDuplicates: true,
        });
      }

      // 5. Insertar ingredientes en la lista de compra
      const ingredientesLista = [...ingredientesMap.values()].map((id) => ({
        lista_compra_id: newList.id,
        ingrediente_id: id,
      }));

      await prisma.ingredienteListaCompra.createMany({
        data: ingredientesLista,
        skipDuplicates: true,
      });
    });

    res.status(201).json({ message: "Menú generado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al generar el menú", detalles: error.message });
  }
};

module.exports = {
  getMenusUsuario,
  getListasCompraUsuario,
  alternarAdquirido,
  generarMenu,
};
