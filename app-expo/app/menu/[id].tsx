import useObtenerMenu from '@/hooks/useObtenerMenu';
import { colors } from '@/styles/colors';
import { radius, shadow, spacing, typography } from '@/styles/globalStyles';
import { router, useLocalSearchParams } from 'expo-router';
import {
  ArrowLeft,
  Calendar,
  ChefHat,
  Clock,
  Coffee,
  Moon,
  Users,
  UtensilsCrossed,
  Heart,
} from 'lucide-react-native';
import React from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import useObtenerRecetasFavoritas, { FullRecipe } from '../../hooks/useObtenerRecetasFavoritas';
import useMarcarFavorito from '../../hooks/useMarcarFavorito';

const styles = StyleSheet.create({
  safeAreaContainer: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollViewContainer: {
    flex: 1,
  },
  header: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  headerActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  backButton: {
    width: 40,
    height: 40,
    backgroundColor: colors.lighterGray,
    borderRadius: radius.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuDateHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.lighterGray,
    marginHorizontal: spacing.xl,
    marginBottom: spacing.xl,
    padding: spacing.lg,
    borderRadius: radius.lg,
    ...shadow.sm,
  },
  menuDate: {
    marginLeft: spacing.md,
    fontSize: typography.h2,
    fontWeight: '600',
    color: colors.primary,
  },
  recipesContainer: {
    paddingHorizontal: spacing.xl,
    gap: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  recipeCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 15,
    borderWidth: 0.5,
    borderColor: 'rgba(200, 200, 200, 0.5)',
  },
  recipeCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 10,
  },
  recipeTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 10,
  },
  recipeTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '700',
    color: colors.black,
  },
  favoriteIndicator: {
    width: 40,
    height: 40,
    backgroundColor: colors.lightRed,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recipeDescription: {
    fontSize: 15,
    color: colors.gray,
    lineHeight: 15 * 1.4,
    marginBottom: 10,
  },
  recipeInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: colors.lightGray,
    paddingTop: 10,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  infoText: {
    fontSize: 13,
    color: colors.gray,
    fontWeight: '500',
  },
  text: {
    fontSize: typography.body1,
    color: colors.black,
  },
  bold: {
    fontWeight: 'bold',
  },
});

// Iconos según tipo de comida
function obtenerIconoComida(tipoComida: string) {
  switch (tipoComida) {
    case 'Desayuno':
      return <Coffee size={24} color={colors.primary} strokeWidth={2} />;
    case 'Almuerzo':
      return <UtensilsCrossed size={24} color={colors.primary} strokeWidth={2} />;
    case 'Cena':
      return <Moon size={24} color={colors.primary} strokeWidth={2} />;
    default:
      return <UtensilsCrossed size={24} color={colors.primary} strokeWidth={2} />;
  }
}

export default function DetalleMenuScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const menuId = parseInt(id, 10);

  // Hooks
  const { menu, cargando, error } = useObtenerMenu(menuId);
  const { recetas: recetasFavoritas } = useObtenerRecetasFavoritas();
  const { marcarFavorito } = useMarcarFavorito();
  const [localRecetas, setLocalRecetas] = React.useState<FullRecipe[]>([]);

  // Sincronizar estado local con las recetas del servidor
  React.useEffect(() => {
    if (recetasFavoritas) {
      setLocalRecetas(recetasFavoritas);
    }
  }, [recetasFavoritas]);

  const handleToggleFavorite = async (recipeId: number) => {
    const recipeToToggle = menu?.recipes.find(r => r.id === recipeId);
    if (!recipeToToggle) return;

    const isFavorite = localRecetas.some(r => r.id === recipeId);
    
    // Actualizar estado local inmediatamente
    if (isFavorite) {
      setLocalRecetas(prev => prev.filter(recipe => recipe.id !== recipeId));
    } else {
      const newRecipe: FullRecipe = {
        ...recipeToToggle,
        favorite: true,
        number_of_servings: recipeToToggle.servings,
        schedules: [{
          mealType: recipeToToggle.mealType,
          date: recipeToToggle.date
        }]
      };
      setLocalRecetas(prev => [newRecipe, ...prev]);
    }

    try {
      await marcarFavorito(recipeId);
    } catch (error) {
      // Revertir el estado si hay error
      if (isFavorite) {
        const newRecipe: FullRecipe = {
          ...recipeToToggle,
          favorite: true,
          number_of_servings: recipeToToggle.servings,
          schedules: [{
            mealType: recipeToToggle.mealType,
            date: recipeToToggle.date
          }]
        };
        setLocalRecetas(prev => [newRecipe, ...prev]);
      } else {
        setLocalRecetas(prev => prev.filter(recipe => recipe.id !== recipeId));
      }
      console.error('Error al marcar/desmarcar favorito:', error);
    }
  };

  if (cargando) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.text, { marginTop: 10 }]}>Cargando menú...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={[styles.text, styles.bold, { color: colors.red }]}>Error</Text>
        <Text style={[styles.text, { textAlign: 'center', marginTop: 10 }]}>
          {error.message}
        </Text>
      </View>
    );
  }

  if (!menu) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={[styles.text, styles.bold]}>Menú no encontrado</Text>
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
          </View>
        </View>

        <View style={styles.menuDateHeader}>
          <Calendar size={24} color={colors.primary} strokeWidth={2} />
          <Text style={styles.menuDate}>{menu.menuDate}</Text>
        </View>
        <View style={styles.recipesContainer}>
          {menu.recipes.map((recipe) => {
            const isFavorite = localRecetas.some(r => r.id === recipe.id);
            
            return (
              <TouchableOpacity
                key={recipe.id}
                style={styles.recipeCard}
                onPress={() => router.push({ pathname: '/receta/[id]', params: { id: recipe.id.toString() } } as any)}
                activeOpacity={0.7}
              >
                <View style={styles.recipeCardHeader}>
                  <View style={styles.recipeTitleContainer}>
                    {obtenerIconoComida(recipe.mealType)}
                    <Text style={styles.recipeTitle} numberOfLines={1}>
                      {recipe.title}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={{
                      width: 40,
                      height: 40,
                      backgroundColor: isFavorite ? colors.red : colors.lightRed,
                      borderRadius: 12,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                    onPress={() => handleToggleFavorite(recipe.id)}
                  >
                    <Heart
                      size={24}
                      color={isFavorite ? colors.white : colors.red}
                      fill={isFavorite ? colors.red : 'none'}
                      strokeWidth={2}
                    />
                  </TouchableOpacity>
                </View>

                <Text style={styles.recipeDescription} numberOfLines={2}>
                  {recipe.description}
                </Text>

                <View style={styles.recipeInfo}>
                  <View style={styles.infoItem}>
                    <Clock size={16} color={colors.gray} strokeWidth={2} />
                    <Text style={styles.infoText}>{recipe.prep_time} min</Text>
                  </View>
                  <View style={styles.infoItem}>
                    <Users size={16} color={colors.gray} strokeWidth={2} />
                    <Text style={styles.infoText}>{recipe.servings}</Text>
                  </View>
                  <View style={styles.infoItem}>
                    <ChefHat size={16} color={colors.gray} strokeWidth={2} />
                    <Text style={styles.infoText}>{recipe.difficulty}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}