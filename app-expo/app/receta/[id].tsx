import useObtenerReceta from '@/hooks/useObtenerReceta';
import { colors } from '@/utils/colors';
import { radius, shadow, spacing, TYPOGRAPHY } from '@/utils/styles';
import { useLocalSearchParams } from 'expo-router';
import { ChefHat, Clock, Cookie, Droplets, Dumbbell, Flame, Users } from 'lucide-react-native';
import React from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function DetalleRecetaScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const recetaId = parseInt(id, 10);

  const { receta, cargando, error } = useObtenerReceta(recetaId);

  if (cargando) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.text, { marginTop: spacing.md }]}>Cargando receta...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={[styles.text, { color: colors.red }]}>
          Error al cargar la receta: {error.message}
        </Text>
      </View>
    );
  }

  if (!receta) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.text}>No se encontró la receta.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.cabeceraReceta}>
        <Text style={styles.tituloReceta}>{receta.recipe.title}</Text>
        <Text style={styles.descripcionReceta}>{receta.recipe.description}</Text>
      </View>

      <View style={styles.contenedorMeta}>
        <View style={styles.itemMeta}>
          <Clock size={20} color={colors.primary} strokeWidth={2} />
          <Text style={styles.etiquetaMeta}>Tiempo</Text>
          <Text style={styles.valorMeta}>{receta.recipe.prep_time} min</Text>
        </View>
        <View style={styles.itemMeta}>
          <Users size={20} color={colors.primary} strokeWidth={2} />
          <Text style={styles.etiquetaMeta}>Porciones</Text>
          <Text style={styles.valorMeta}>{receta.recipe.number_of_servings}</Text>
        </View>
        <View style={styles.itemMeta}>
          <ChefHat size={20} color={colors.primary} strokeWidth={2} />
          <Text style={styles.etiquetaMeta}>Dificultad</Text>
          <Text style={styles.valorMeta}>{receta.recipe.difficulty}</Text>
        </View>
      </View>

      <View style={styles.seccion}>
        <Text style={styles.tituloSeccion}>Información Nutricional</Text>
        <View style={styles.gridNutricion}>
          <View style={styles.itemNutricion}>
            <Flame size={24} color={colors.primary} strokeWidth={2} />
            <Text style={styles.valorNutricion}>{receta.recipe.calories}</Text>
            <Text style={styles.etiquetaNutricion}>Calorías</Text>
          </View>
          <View style={styles.itemNutricion}>
            <Dumbbell size={24} color={colors.primary} strokeWidth={2} />
            <Text style={styles.valorNutricion}>{receta.recipe.protein}g</Text>
            <Text style={styles.etiquetaNutricion}>Proteínas</Text>
          </View>
          <View style={styles.itemNutricion}>
            <Cookie size={24} color={colors.primary} strokeWidth={2} />
            <Text style={styles.valorNutricion}>{receta.recipe.carbohydrates}g</Text>
            <Text style={styles.etiquetaNutricion}>Carbohidratos</Text>
          </View>
          <View style={styles.itemNutricion}>
            <Droplets size={24} color={colors.primary} strokeWidth={2} />
            <Text style={styles.valorNutricion}>{receta.recipe.fat}g</Text>
            <Text style={styles.etiquetaNutricion}>Grasas</Text>
          </View>
        </View>
      </View>

      <View style={styles.seccion}>
        <Text style={styles.tituloSeccion}>Ingredientes</Text>
        <View style={styles.listaIngredientes}>
          {receta.ingredients.map((ingrediente, index) => (
            <View key={index} style={styles.itemIngrediente}>
              <View style={styles.puntoIngrediente} />
              <Text style={styles.textoIngrediente}>
                {ingrediente.quantity} {ingrediente.unit} de {ingrediente.name}
                {ingrediente.note ? ` (${ingrediente.note})` : ''}
              </Text>
            </View>
          ))}
        </View>
      </View>

      <View style={[styles.seccion, styles.seccionUltima]}>
        <Text style={styles.tituloSeccion}>Preparación</Text>
        <View style={styles.contenedorPreparacion}>
          {receta.recipe.instructions.split('\n').map((paso, index) => (
            <View key={index} style={styles.pasoPreparacion}>
              <View style={styles.numeroPaso}>
                <Text style={styles.textoNumeroPaso}>{index + 1}</Text>
              </View>
              <Text style={styles.textoPaso}>{paso}</Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: TYPOGRAPHY.body1,
    color: colors.black,
  },
  cabeceraReceta: {
    padding: spacing.xl,
    paddingBottom: spacing.lg,
  },
  tituloReceta: {
    fontSize: TYPOGRAPHY.h1,
    fontWeight: 'bold',
    color: colors.black,
    marginBottom: spacing.sm,
  },
  descripcionReceta: {
    fontSize: TYPOGRAPHY.body1,
    color: colors.gray,
    lineHeight: TYPOGRAPHY.body1 * 1.4,
  },
  contenedorMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
    backgroundColor: colors.lighterGray,
    borderRadius: radius.md,
    marginHorizontal: spacing.xl,
    marginBottom: spacing.xl,
    ...shadow.sm,
  },
  itemMeta: {
    alignItems: 'center',
    flex: 1,
  },
  etiquetaMeta: {
    fontSize: TYPOGRAPHY.caption,
    color: colors.gray,
    marginTop: spacing.xs,
  },
  valorMeta: {
    fontSize: TYPOGRAPHY.body1,
    fontWeight: '600',
    color: colors.black,
    marginTop: spacing.xs,
  },
  seccion: {
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.xl,
  },
  seccionUltima: {
    paddingBottom: spacing.xxl,
  },
  tituloSeccion: {
    fontSize: TYPOGRAPHY.h2,
    fontWeight: '600',
    color: colors.black,
    marginBottom: spacing.md,
  },
  gridNutricion: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  itemNutricion: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: colors.lighterGray,
    borderRadius: radius.md,
    padding: spacing.lg,
    alignItems: 'center',
    ...shadow.sm,
  },
  valorNutricion: {
    fontSize: TYPOGRAPHY.h2,
    fontWeight: 'bold',
    color: colors.primary,
    marginVertical: spacing.xs,
  },
  etiquetaNutricion: {
    fontSize: TYPOGRAPHY.body2,
    color: colors.gray,
  },
  listaIngredientes: {
    backgroundColor: colors.lighterGray,
    borderRadius: radius.md,
    padding: spacing.lg,
    ...shadow.sm,
  },
  itemIngrediente: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  puntoIngrediente: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
    marginRight: spacing.md,
  },
  textoIngrediente: {
    flex: 1,
    fontSize: TYPOGRAPHY.body1,
    color: colors.black,
  },
  contenedorPreparacion: {
    backgroundColor: colors.lighterGray,
    borderRadius: radius.md,
    padding: spacing.lg,
    ...shadow.sm,
  },
  pasoPreparacion: {
    flexDirection: 'row',
    marginBottom: spacing.lg,
    alignItems: 'flex-start',
  },
  numeroPaso: {
    width: 28,
    height: 28,
    borderRadius: radius.lg,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
    marginTop: spacing.xs,
  },
  textoNumeroPaso: {
    color: colors.white,
    fontSize: TYPOGRAPHY.body2,
    fontWeight: '600',
  },
  textoPaso: {
    flex: 1,
    fontSize: TYPOGRAPHY.body1,
    color: colors.black,
    lineHeight: TYPOGRAPHY.body1 * 1.4,
  },
});
