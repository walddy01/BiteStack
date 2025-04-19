// menuController.js

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { zodResponseFormat } = require("openai/helpers/zod");
const { z } = require("zod");
const { OpenAI } = require("openai");

const openai = new OpenAI({
  apiKey: process.env.GEMINI_API_KEY,
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai",
});

/** Devuelve el lunes de la semana de la fecha dada */
function getStartOfWeek(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // semana inicia el lunes
  return new Date(d.setDate(diff));
}

/** Formatea Date a "YYYY-MM-DD" */
function formatDate(date) {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// Esquemas Zod para validar la respuesta de IA
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

/** GET /menus/usuario/:id */
const getMenusUsuario = async (req, res) => {
  try {
    const userId = parseInt(req.params.id, 10);

    const menus = await prisma.menu.findMany({
      where: { usuario_id: userId },
      orderBy: { created_at: "desc" },
      include: {
        recetasProgramadas: {
          include: {
            receta: {
              select: {
                id: true,
                titulo: true,
                descripcion: true,
                tiempo_prep: true,
                numero_raciones: true,
                dificultad: true,
                favorito: true,
              },
            },
          },
        },
      },
    });

    const data = menus.map(menu => ({
      menuId: menu.id,
      menuDate: formatDate(menu.fecha_inicio_semana),
      recipes: menu.recetasProgramadas.map(rp => ({
        id: rp.receta.id,
        title: rp.receta.titulo,
        description: rp.receta.descripcion,
        prep_time: rp.receta.tiempo_prep,
        servings: rp.receta.numero_raciones,
        difficulty: rp.receta.dificultad,
        favorite: rp.receta.favorito,
        date: formatDate(rp.fecha),
        mealType: rp.tipo_comida,
      })),
    }));

    res.json({ message: "Menús obtenidos correctamente", data });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Ocurrió un error al obtener los menús",
      details: error.message,
    });
  }
};

/** GET /menu/semana/usuario/:id */
const getMenuSemanaUsuario = async (req, res) => {
  try {
    const userId = parseInt(req.params.id, 10);

    const startOfWeek = getStartOfWeek(new Date());
    const startOfWeekDate = new Date(formatDate(startOfWeek));

    const menu = await prisma.menu.findFirst({
      where: {
        usuario_id: userId,
        fecha_inicio_semana: startOfWeekDate,
      },
      orderBy: { created_at: "desc" },
      include: {
        recetasProgramadas: {
          include: {
            receta: {
              select: {
                id: true,
                titulo: true,
                descripcion: true,
                tiempo_prep: true,
                numero_raciones: true,
                dificultad: true,
                favorito: true,
              },
            },
          },
        },
      },
    });

    if (!menu) {
      return res.status(200).json({
        message: "No se encontró un menú para la semana actual",
        data: [],
      });
    }

    const data = {
      menuId: menu.id,
      menuDate: formatDate(menu.fecha_inicio_semana),
      recipes: menu.recetasProgramadas.map(rp => ({
        id: rp.receta.id,
        title: rp.receta.titulo,
        description: rp.receta.descripcion,
        prep_time: rp.receta.tiempo_prep,
        servings: rp.receta.numero_raciones,
        difficulty: rp.receta.dificultad,
        favorite: rp.receta.favorito,
        date: formatDate(rp.fecha),
        mealType: rp.tipo_comida,
      })),
    };

    res.json({ message: "Menú obtenido correctamente", data });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Ocurrió un error al obtener el menú",
      details: error.message,
    });
  }
};

/** GET /listas-compra/usuario/:id */
const getListasCompraUsuario = async (req, res) => {
  try {
    const userId = parseInt(req.params.id, 10);

    const menus = await prisma.menu.findMany({
      where: { usuario_id: userId },
      orderBy: { created_at: "desc" },
    });

    const allLists = await Promise.all(
      menus.map(async menu => {
        const listasCompra = await prisma.listaCompra.findMany({
          where: { menu_id: menu.id },
        });

        return Promise.all(
          listasCompra.map(async lista => {
            const ingredientesLista = await prisma.ingredienteListaCompra.findMany({
              where: { lista_compra_id: lista.id },
              include: { ingrediente: true },
            });

            const ingredients = ingredientesLista.map(item => ({
              id: item.ingrediente.id,
              name: item.ingrediente.nombre,
              acquired: item.adquirido,
            }));

            return {
              shoppingListId: lista.id,
              date: formatDate(menu.fecha_inicio_semana),
              ingredients,
            };
          })
        );
      })
    );

    const data = allLists.flat();
    res.json({ message: "Listas de compra obtenidas correctamente", data });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Ocurrió un error al obtener las listas de compra",
      details: error.message,
    });
  }
};

/** PATCH /lista/:idLista/ingrediente/:idIngrediente */
const alternarAdquirido = async (req, res) => {
  try {
    const idLista = parseInt(req.params.idLista, 10);
    const idIngrediente = parseInt(req.params.idIngrediente, 10);

    const item = await prisma.ingredienteListaCompra.findFirst({
      where: { lista_compra_id: idLista, ingrediente_id: idIngrediente },
    });
    if (!item) {
      return res.status(404).json({ error: "Ingrediente en la lista no encontrado" });
    }

    const updated = await prisma.ingredienteListaCompra.update({
      where: { id: item.id },
      data: { adquirido: !item.adquirido },
    });

    res.json({
      message: `Ingrediente ${updated.adquirido ? "marcado como adquirido" : "desmarcado como adquirido"}`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Ocurrió un error al alternar el estado de adquirido",
      details: error.message,
    });
  }
};

/** POST /generar-menu/:id */
const generarMenu = async (req, res) => {
  const userId = parseInt(req.params.id, 10);

  // Determinar tipos de comida
  let selectedMealTypes = [];
  if (req.body.desayuno) selectedMealTypes.push("Desayuno");
  if (req.body.almuerzo) selectedMealTypes.push("Almuerzo");
  if (req.body.cena) selectedMealTypes.push("Cena");
  if (selectedMealTypes.length === 0) {
    selectedMealTypes = ["Desayuno", "Almuerzo", "Cena"];
  }
  const mealsPerDay = selectedMealTypes.length;

  try {
    // Obtener datos del usuario
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

    // Fecha inicio de la semana
    const startOfWeek = getStartOfWeek(new Date());
    const startOfWeekDate = new Date(formatDate(startOfWeek));

    // Verificar si ya existe menú para esta semana
    const existing = await prisma.menu.findFirst({
      where: { usuario_id: userId, fecha_inicio_semana: startOfWeekDate },
    });
    if (existing) {
      return res.status(409).json({ error: "Ya existe un menú para esta semana." });
    }

    // Construir prompts para IA
    const prompts = [];
    for (let day = 0; day < 7; day++) {
      selectedMealTypes.forEach(meal => {
        let prompt = `Genera una receta saludable para ${meal} del día ${day + 1}.`;
        if (usuario.dieta) prompt += ` Dieta: ${usuario.dieta}.`;
        if (usuario.calorias) prompt += ` Calorías deseadas: ${usuario.calorias}.`;
        if (usuario.alergias) prompt += ` Alergias: ${usuario.alergias}.`;
        if (usuario.porciones) prompt += ` Porciones: ${usuario.porciones}.`;
        if (usuario.preferencias_adicionales) {
          prompt += ` Preferencias adicionales: ${usuario.preferencias_adicionales}.`;
        }
        prompts.push(prompt);
      });
    }

    // Función interna para generar receta con IA
    const generarRecetaAI = async prompt => {
      const systemPrompt = `
Generate a recipe in JSON format with:
- title, description, number_of_servings, difficulty, prep_time
- ingredients (ingredient, notes, amount, unit SI)
- instructions
- total_calories_per_serving, protein_per_serving, carbohydrates_per_serving, fat_per_serving
La receta debe estar en español y los field names en inglés.`;
      const completion = await openai.beta.chat.completions.parse({
        model: "gemini-2.0-flash-lite",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: prompt },
        ],
        response_format: zodResponseFormat(RecetaSchema, "receta"),
      });
      return completion.choices[0].message.parsed;
    };

    // Generar todas las recetas IA
    const recetasIA = [];
    for (let day = 0; day < 7; day++) {
      const batch = prompts.slice(day * mealsPerDay, day * mealsPerDay + mealsPerDay);
      const dayRecipes = await Promise.all(batch.map(generarRecetaAI));
      recetasIA.push(...dayRecipes);
    }

    // Transacción principal: crear menú, lista, recetas y programaciones
    const { newMenu, newList, recetasCreadas } = await prisma.$transaction(async tx => {
      const m = await tx.menu.create({
        data: { usuario_id: userId, fecha_inicio_semana: startOfWeekDate },
      });
      const l = await tx.listaCompra.create({ data: { menu_id: m.id } });
      const created = [];

      for (let i = 0; i < recetasIA.length; i++) {
        const rIA = recetasIA[i];
        const dayIndex = Math.floor(i / mealsPerDay);
        const mealIndex = i % mealsPerDay;
        const tipo_comida = selectedMealTypes[mealIndex];
        const fechaRec = new Date(startOfWeekDate);
        fechaRec.setDate(fechaRec.getDate() + dayIndex);

        const recetaCreada = await tx.receta.create({
          data: {
            titulo: rIA.title,
            descripcion: rIA.description,
            numero_raciones: rIA.number_of_servings,
            dificultad: rIA.difficulty,
            tiempo_prep: rIA.prep_time,
            instrucciones: rIA.instructions.join("\n"),
            calorias: Math.round(rIA.total_calories_per_serving * rIA.number_of_servings),
            proteinas: Math.round(rIA.protein_per_serving * rIA.number_of_servings),
            carbohidratos: Math.round(rIA.carbohydrates_per_serving * rIA.number_of_servings),
            grasas: Math.round(rIA.fat_per_serving * rIA.number_of_servings),
            favorito: false,
            usuario_id: userId,
          },
        });
        created.push(recetaCreada);

        await tx.menuRecetaDia.create({
          data: {
            menu_id: m.id,
            receta_id: recetaCreada.id,
            fecha: fechaRec,
            tipo_comida,
          },
        });
      }

      return { newMenu: m, newList: l, recetasCreadas: created };
    });

    // Insertar ingredientes únicos en tabla Ingrediente
    const ingredientesUnicos = new Map();
    recetasIA.forEach(r => {
      r.ingredients.forEach(ing => {
        if (!ingredientesUnicos.has(ing.ingredient)) {
          ingredientesUnicos.set(ing.ingredient, ing);
        }
      });
    });
    if (ingredientesUnicos.size > 0) {
      await prisma.ingrediente.createMany({
        data: [...ingredientesUnicos.values()].map(ing => ({ nombre: ing.ingredient })),
        skipDuplicates: true,
      });
    }

    // Obtener IDs de ingredientes
    const ingredientesDB = await prisma.ingrediente.findMany({
      where: { nombre: { in: [...ingredientesUnicos.keys()] } },
      select: { id: true, nombre: true },
    });
    const ingredientesMap = new Map(ingredientesDB.map(i => [i.nombre, i.id]));

    // Crear relaciones RecetaIngrediente
    const rels = [];
    recetasIA.forEach((r, idx) => {
      const recetaId = recetasCreadas[idx].id;
      r.ingredients.forEach(ing => {
        const ingId = ingredientesMap.get(ing.ingredient);
        if (ingId) {
          rels.push({
            receta_id: recetaId,
            ingrediente_id: ingId,
            cantidad: ing.amount.toString(),
            unidad: ing.unit,
            nota: ing.notes || "",
          });
        }
      });
    });
    if (rels.length > 0) {
      await prisma.recetaIngrediente.createMany({
        data: rels,
        skipDuplicates: true,
      });
    }

    // Añadir ingredientes a la lista de compra
    const listaItems = [...ingredientesMap.values()].map(ingId => ({
      lista_compra_id: newList.id,
      ingrediente_id: ingId,
    }));
    if (listaItems.length > 0) {
      await prisma.ingredienteListaCompra.createMany({
        data: listaItems,
        skipDuplicates: true,
      });
    }

    res.status(201).json({ message: "Menú generado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Error al generar el menú",
      details: error.message,
    });
  }
};

module.exports = {
  getMenusUsuario,
  getMenuSemanaUsuario,
  getListasCompraUsuario,
  alternarAdquirido,
  generarMenu,
};
