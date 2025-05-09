import useMarcarFavorito from '@/hooks/useMarcarFavorito';
import useObtenerReceta from '@/hooks/useObtenerReceta';
import { colors } from '@/styles/colors';
import { radius, shadow, spacing, typography } from '@/styles/styles';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, ChefHat, Clock, Cookie, Droplets, Dumbbell, Flame, Heart, RefreshCw, Users } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function DetalleRecetaScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const recetaId = parseInt(id, 10);
  
  const { receta, cargando, error } = useObtenerReceta(recetaId);
  const { marcarFavorito } = useMarcarFavorito();
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (receta?.recipe) {
      setIsFavorite(receta.recipe.favorite);
    }
  }, [receta]);

  const toggleFavorite = async () => {
    // Actualización optimista
    setIsFavorite(prevState => !prevState);
    
    try {
      await marcarFavorito(recetaId);
    } catch (error) {
      // Si hay error, revertimos el estado
      setIsFavorite(prevState => !prevState);
      console.error('Error al marcar como favorito:', error);
    }
  };

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
    <SafeAreaView style={styles.safeAreaContainer}>
      <ScrollView style={styles.scrollViewContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <ArrowLeft size={24} color={colors.black} />
            </TouchableOpacity>
            <View style={styles.rightHeaderActions}>
              <TouchableOpacity
                style={styles.regenerateButton}
                onPress={() => console.log('Regenerar receta (funcionalidad pendiente)')}
              >
                <RefreshCw size={24} color={colors.primary} />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.favoriteButton, isFavorite && styles.favoriteButtonActive]}
                onPress={toggleFavorite}
              >
                <Heart
                  size={24}
                  color={isFavorite ? colors.white : colors.red}
                  fill={isFavorite ? colors.red : 'none'}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.content}>
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
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeAreaContainer: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollViewContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: typography.body1,
    color: colors.black,
  },
  header: {
    padding: spacing.md,
  },
  headerActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rightHeaderActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    width: 40,
    height: 40,
    backgroundColor: colors.lighterGray,
    borderRadius: radius.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  regenerateButton: {
    width: 40,
    height: 40,
    backgroundColor: colors.lighterGray,
    borderRadius: radius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  favoriteButton: {
    width: 40,
    height: 40,
    backgroundColor: colors.lightRed,
    borderRadius: radius.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  favoriteButtonActive: {
    backgroundColor: colors.red,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.xl,
  },
  cabeceraReceta: {
    paddingBottom: spacing.lg,
  },
  tituloReceta: {
    fontSize: typography.h1,
    fontWeight: 'bold',
    color: colors.black,
    marginBottom: spacing.sm,
  },
  descripcionReceta: {
    fontSize: typography.body1,
    color: colors.gray,
    lineHeight: typography.body1 * 1.4,
  },
  contenedorMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
    backgroundColor: colors.lighterGray,
    borderRadius: radius.md,
    marginBottom: spacing.xl,
    ...shadow.sm,
  },
  itemMeta: {
    alignItems: 'center',
    flex: 1,
  },
  etiquetaMeta: {
    fontSize: typography.caption,
    color: colors.gray,
    marginTop: spacing.xs,
  },
  valorMeta: {
    fontSize: typography.body1,
    fontWeight: '600',
    color: colors.black,
    marginTop: spacing.xs,
  },
  seccion: {
    marginBottom: spacing.xl,
  },
  seccionUltima: {
    paddingBottom: spacing.xxl,
  },
  tituloSeccion: {
    fontSize: typography.h2,
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
    fontSize: typography.h2,
    fontWeight: 'bold',
    color: colors.primary,
    marginVertical: spacing.xs,
  },
  etiquetaNutricion: {
    fontSize: typography.body2,
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
    fontSize: typography.body1,
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
    fontSize: typography.body2,
    fontWeight: '600',
  },
  textoPaso: {
    flex: 1,
    fontSize: typography.body1,
    color: colors.black,
    lineHeight: typography.body1 * 1.4,
  },
});
