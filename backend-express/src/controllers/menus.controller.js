const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { zodResponseFormat } = require("openai/helpers/zod");
const { z } = require("zod");
const { OpenAI } = require("openai");

const openai = new OpenAI({
  apiKey: process.env.GEMINI_API_KEY,
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai",
});

// Devuelve el lunes de la semana de la fecha dada
function obtenerInicioSemana(fecha) {
  const d = new Date(fecha);
  const dia = d.getDay();
  const diff = d.getDate() - dia + (dia === 0 ? -6 : 1); // semana inicia el lunes
  return new Date(d.setDate(diff));
}

// Formatea Date a "YYYY-MM-DD"
function formatearFecha(fecha) {
  const d = new Date(fecha);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// Esquemas Zod para validar la respuesta de IA
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

// GET /menus/
const getMenusUsuario = async (req, res) => {
  try {
    const idUsuario = req.user.id;

    const listaMenus = await prisma.menu.findMany({
      where: { usuario_id: idUsuario },
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

    const data = listaMenus.map(menu => ({
      menuId: menu.id,
      menuDate: formatearFecha(menu.fecha_inicio_semana),
      recipes: menu.recetasProgramadas.map(recetaProg => ({
        id: recetaProg.receta.id,
        title: recetaProg.receta.titulo,
        description: recetaProg.receta.descripcion,
        prep_time: recetaProg.receta.tiempo_prep,
        servings: recetaProg.receta.numero_raciones,
        difficulty: recetaProg.receta.dificultad,
        favorite: recetaProg.receta.favorito,
        date: formatearFecha(recetaProg.fecha),
        mealType: recetaProg.tipo_comida,
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

// GET /menus/semana
const getMenuSemanaUsuario = async (req, res) => {
  try {
    const idUsuario = req.user.id;

    const inicioSemana = obtenerInicioSemana(new Date());
    const fechaInicioSemana = new Date(formatearFecha(inicioSemana));

    const menuSemana = await prisma.menu.findFirst({
      where: {
        usuario_id: idUsuario,
        fecha_inicio_semana: fechaInicioSemana,
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

    if (!menuSemana) {
      return res.status(200).json({
        message: "No se encontró un menú para la semana actual",
        data: [],
      });
    }

    const data = {
      menuId: menuSemana.id,
      menuDate: formatearFecha(menuSemana.fecha_inicio_semana),
      recipes: menuSemana.recetasProgramadas.map(recetaProg => ({
        id: recetaProg.receta.id,
        title: recetaProg.receta.titulo,
        description: recetaProg.receta.descripcion,
        prep_time: recetaProg.receta.tiempo_prep,
        servings: recetaProg.receta.numero_raciones,
        difficulty: recetaProg.receta.dificultad,
        favorite: recetaProg.receta.favorito,
        date: formatearFecha(recetaProg.fecha),
        mealType: recetaProg.tipo_comida,
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

// GET /menus/listascompra
const getListasCompraUsuario = async (req, res) => {
  try {
    const idUsuario = req.user.id;

    const listaMenus = await prisma.menu.findMany({
      where: { usuario_id: idUsuario },
      orderBy: { created_at: "desc" },
    });

    const todasListas = await Promise.all(
      listaMenus.map(async menu => {
        const listasCompraMenu = await prisma.listaCompra.findMany({
          where: { menu_id: menu.id },
        });

        return Promise.all(
          listasCompraMenu.map(async lista => {
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
              date: formatearFecha(menu.fecha_inicio_semana),
              ingredients,
            };
          })
        );
      })
    );

    const data = todasListas.flat();
    res.json({ message: "Listas de compra obtenidas correctamente", data });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Ocurrió un error al obtener las listas de compra",
      details: error.message,
    });
  }
};

// PATCH /menus/listascompra/adquirido/:idLista/:idIngrediente
const alternarAdquirido = async (req, res) => {
  try {
    const idLista = parseInt(req.params.idLista, 10);
    const idIngrediente = parseInt(req.params.idIngrediente, 10);

    const itemLista = await prisma.ingredienteListaCompra.findFirst({
      where: { lista_compra_id: idLista, ingrediente_id: idIngrediente },
    });
    if (!itemLista) {
      return res.status(404).json({ error: "Ingrediente en la lista no encontrado" });
    }

    const actualizado = await prisma.ingredienteListaCompra.update({
      where: { id: itemLista.id },
      data: { adquirido: !itemLista.adquirido },
    });

    res.json({
      message: `Ingrediente ${actualizado.adquirido ? "marcado como adquirido" : "desmarcado como adquirido"}`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Ocurrió un error al alternar el estado de adquirido",
      details: error.message,
    });
  }
};

// POST /menus/generar
const generarMenu = async (req, res) => {
  console.time("total");
  const idUsuario = req.user.id;

  // 1. Obtener datos del usuario
  console.time("fetch-usuario");
  const datosUsuario = await prisma.usuario.findUnique({
    where: { id: idUsuario },
    select: {
      dieta: true,
      calorias: true,
      alergias: true,
      porciones: true,
      preferencias_adicionales: true,
    },
  });
  console.timeEnd("fetch-usuario");
  if (!datosUsuario) {
    console.timeEnd("total");
    return res.status(404).json({ error: "Usuario no encontrado" });
  }

  // 2. Fecha de inicio de la semana y comprobación de menú existente
  console.time("check-menu-existente");
  const inicioSemana = obtenerInicioSemana(new Date());
  const fechaInicioSemana = new Date(formatearFecha(inicioSemana));
  const menuExistente = await prisma.menu.findFirst({
    where: {
      usuario_id: idUsuario,
      fecha_inicio_semana: fechaInicioSemana,
    },
  });
  console.timeEnd("check-menu-existente");
  if (menuExistente) {
    console.timeEnd("total");
    return res
      .status(409)
      .json({ error: "Ya existe un menú para esta semana." });
  }

  // 3. Determinar comidas seleccionadas y construir lista de prompts
  console.time("build-prompts");
  let tiposComidaSeleccionados = [];
  if (req.body.desayuno) tiposComidaSeleccionados.push("Desayuno");
  if (req.body.almuerzo) tiposComidaSeleccionados.push("Almuerzo");
  if (req.body.cena) tiposComidaSeleccionados.push("Cena");
  if (tiposComidaSeleccionados.length === 0) {
    tiposComidaSeleccionados = ["Desayuno", "Almuerzo", "Cena"];
  }
  const comidasPorDia = tiposComidaSeleccionados.length;

  const listaPrompts = [];
  for (let dia = 0; dia < 7; dia++) {
    tiposComidaSeleccionados.forEach(comida => {
      let prompt = `Genera una receta saludable para ${comida} del día ${
        dia + 1
      }.`; 
      if (datosUsuario.dieta) prompt += ` Dieta: ${datosUsuario.dieta}.`;
      if (datosUsuario.calorias)
        prompt += ` Calorías deseadas: ${datosUsuario.calorias}.`;
      if (datosUsuario.alergias)
        prompt += ` Alergias: ${datosUsuario.alergias}.`;
      if (datosUsuario.porciones)
        prompt += ` Porciones: ${datosUsuario.porciones}.`;
      if (datosUsuario.preferencias_adicionales) {
        prompt += ` Preferencias adicionales: ${
          datosUsuario.preferencias_adicionales
        }.`;
      }
      listaPrompts.push(prompt);
    });
  }
  console.timeEnd("build-prompts");

  // 4. Llamadas a la IA
  console.time("generate-IA");
  const generarRecetaAI = async prompt => {
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
    - **Ingredient Notes**: Use the "notes" field for an ingredient only when it's genuinely necessary for clarification (e.g., "Tomatoes, ripe", "Milk, preferably whole"). Avoid using "notes" for trivial details that are obvious or don't significantly impact the recipe.
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
      response_format: zodResponseFormat(SchemaReceta, "receta"),
    });
    return completion.choices[0].message.parsed;
  };

  const recetasGeneradasIA = [];
  for (let dia = 0; dia < 7; dia++) {
    const lote = listaPrompts.slice(
      dia * comidasPorDia,
      dia * comidasPorDia + comidasPorDia
    );
    const recetasDia = await Promise.all(lote.map(generarRecetaAI));
    recetasGeneradasIA.push(...recetasDia);
  }
  console.timeEnd("generate-IA");

  // 5. Transacción principal (menú, lista, recetas y menú-receta)
  console.time("db-transaction");
  const { nuevoMenu, nuevaLista, recetasGuardadas } =
    await prisma.$transaction(
      async tx => {
        const menuCreado = await tx.menu.create({
          data: {
            usuario_id: idUsuario,
            fecha_inicio_semana: fechaInicioSemana,
          },
        });
        const listaCreada = await tx.listaCompra.create({
          data: { menu_id: menuCreado.id },
        });

        const recetasTemp = [];
        for (let i = 0; i < recetasGeneradasIA.length; i++) {
          const recetaIA = recetasGeneradasIA[i];
          const diaIdx = Math.floor(i / comidasPorDia);
          const comidaIdx = i % comidasPorDia;
          const tipo_comida = tiposComidaSeleccionados[comidaIdx];
          const fechaReceta = new Date(fechaInicioSemana);
          fechaReceta.setDate(fechaReceta.getDate() + diaIdx);

          const recetaCreada = await tx.receta.create({
            data: {
              titulo: recetaIA.title,
              descripcion: recetaIA.description,
              numero_raciones: recetaIA.number_of_servings,
              dificultad: recetaIA.difficulty,
              tiempo_prep: recetaIA.prep_time,
              instrucciones: recetaIA.instructions.join("\n"),
              calorias: Math.round(
                recetaIA.total_calories_per_serving *
                  recetaIA.number_of_servings
              ),
              proteinas: Math.round(
                recetaIA.protein_per_serving * recetaIA.number_of_servings
              ),
              carbohidratos: Math.round(
                recetaIA.carbohydrates_per_serving *
                  recetaIA.number_of_servings
              ),
              grasas: Math.round(
                recetaIA.fat_per_serving * recetaIA.number_of_servings
              ),
              favorito: false,
              usuario_id: idUsuario,
            },
          });
          recetasTemp.push(recetaCreada);

          await tx.menuRecetaDia.create({
            data: {
              menu_id: menuCreado.id,
              receta_id: recetaCreada.id,
              fecha: fechaReceta,
              tipo_comida,
            },
          });
        }
        return {
          nuevoMenu: menuCreado,
          nuevaLista: listaCreada,
          recetasGuardadas: recetasTemp,
        };
      },
      { timeout: 120000 }
    );
  console.timeEnd("db-transaction");

  // 6. Insertar ingredientes únicos
  console.time("insert-ingredientes");
  const mapaIngredientesUnicos = new Map();
  recetasGeneradasIA.forEach(r =>
    r.ingredients.forEach(ing => {
      if (!mapaIngredientesUnicos.has(ing.ingredient)) {
        mapaIngredientesUnicos.set(ing.ingredient, ing);
      }
    })
  );
  if (mapaIngredientesUnicos.size) {
    await prisma.ingrediente.createMany({
      data: [...mapaIngredientesUnicos.values()].map(ing => ({
        nombre: ing.ingredient,
      })),
      skipDuplicates: true,
    });
  }
  console.timeEnd("insert-ingredientes");

  // 7. Obtener IDs de ingredientes
  console.time("fetch-ingredientes-db");
  const ingredientesEnDB = await prisma.ingrediente.findMany({
    where: { nombre: { in: [...mapaIngredientesUnicos.keys()] } },
    select: { id: true, nombre: true },
  });
  console.timeEnd("fetch-ingredientes-db");

  // 8. Crear relaciones receta-ingrediente
  console.time("insert-relaciones");
  const mapaIdsIngredientes = new Map(
    ingredientesEnDB.map(ing => [ing.nombre, ing.id])
  );
  const relaciones = [];
  recetasGeneradasIA.forEach((recIA, idx) => {
    const idReceta = recetasGuardadas[idx].id;
    recIA.ingredients.forEach(ing => {
      const idIng = mapaIdsIngredientes.get(ing.ingredient);
      if (idIng) {
        relaciones.push({
          receta_id: idReceta,
          ingrediente_id: idIng,
          cantidad: ing.amount.toString(),
          unidad: ing.unit,
          nota: ing.notes || "",
        });
      }
    });
  });
  if (relaciones.length) {
    await prisma.recetaIngrediente.createMany({
      data: relaciones,
      skipDuplicates: true,
    });
  }
  console.timeEnd("insert-relaciones");

  // 9. Crear y devolver la respuesta
  console.time("build-response");
  const menuFormateado = {
    id: nuevoMenu.id,
    fecha_inicio_semana: formatearFecha(nuevoMenu.fecha_inicio_semana),
    recetas: await prisma.menuRecetaDia.findMany({
      where: { menu_id: nuevoMenu.id },
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
            instrucciones: true,
            calorias: true,
            proteinas: true,
            carbohidratos: true,
            grasas: true,
          },
        },
      },
    }),
  };
  console.timeEnd("build-response");

  console.timeEnd("total");
  res.status(201).json({ message: "Menú generado correctamente", data: menuFormateado });
};

module.exports = {
  getMenusUsuario,
  getMenuSemanaUsuario,
  getListasCompraUsuario,
  alternarAdquirido,
  generarMenu,
};
