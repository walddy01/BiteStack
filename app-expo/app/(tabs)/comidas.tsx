import React from 'react';
import { useAuth } from "@/hooks/useAuth";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { colors } from "../../styles/colors";
import { styles as globalStyles } from '../../styles/globalStyles';
import { FontAwesome5 } from '@expo/vector-icons';
import {
  Clock,
  Users,
  ChefHat,
  Coffee,
  UtensilsCrossed,
  Moon,
  Heart,
} from 'lucide-react-native';
import useMarcarFavorito from '../../hooks/useMarcarFavorito';
import useObtenerRecetasFavoritas, { FullRecipe } from '../../hooks/useObtenerRecetasFavoritas';
import useObtenerHistorialMenu from '../../hooks/useObtenerHistorialMenus';
import { useFocusEffect } from '@react-navigation/native';
import { router } from 'expo-router'; // Importar router desde expo-router

// Icono según tipo de comida
function obtenerIconoComida(tipoComida: string) {
  switch (tipoComida) {
    case 'Desayuno':
      return <Coffee size={20} color={colors.primary} strokeWidth={2} />;
    case 'Almuerzo':
      return <UtensilsCrossed size={20} color={colors.primary} strokeWidth={2} />;
    case 'Cena':
      return <Moon size={20} color={colors.primary} strokeWidth={2} />;
    default:
      return <UtensilsCrossed size={20} color={colors.primary} strokeWidth={2} />;
  }
}

// Ofusca el título si es muy largo
function ofuscarTitulo(titulo: string, max: number = 22) {
  return titulo.length > max ? titulo.slice(0, max - 3) + '...' : titulo;
}

export default function Comidas() {
  const { session } = useAuth();
  const [activeTab, setActiveTab] = React.useState<'menus' | 'recipes'>('menus');

  // Hook para recetas favoritas
  const {
    recetas,
    cargando: cargandoRecetas,
    error: errorRecetas,
    refrescar: refrescarRecetas,
  } = useObtenerRecetasFavoritas();

  // Hook para historial de menús
  const {
    menus,
    cargando: cargandoMenus,
    error: errorMenus,
    refrescar: refrescarMenus,
  } = useObtenerHistorialMenu();

  const { marcarFavorito, error: errorFavorito } = useMarcarFavorito();
  const [localRecetas, setLocalRecetas] = React.useState<FullRecipe[]>([]);

  // Sincroniza el estado local con el hook cuando cambian las recetas
  React.useEffect(() => {
    setLocalRecetas(recetas);
  }, [recetas]);

  // Refresca datos al entrar en foco
  useFocusEffect(
    React.useCallback(() => {
      refrescarRecetas();
      refrescarMenus();
    }, [refrescarRecetas, refrescarMenus])
  );

  // Maneja el toggle de favorito con eliminación instantánea si se quita de favoritas
  const handleToggleFavorite = async (recipeId: number) => {
    const recipeToToggle = localRecetas.find(r => r.id === recipeId);
    if (!recipeToToggle) return;

    if (recipeToToggle.favorite) {
      setLocalRecetas(prev => prev.filter(recipe => recipe.id !== recipeId));
    } else {
      setLocalRecetas(prev =>
        prev.map(recipe =>
          recipe.id === recipeId
            ? { ...recipe, favorite: true }
            : recipe
        )
      );
    }

    try {
      await marcarFavorito(recipeId);
      if (errorFavorito && recipeToToggle.favorite) {
        setLocalRecetas(prev => [recipeToToggle, ...prev]);
      }
    } catch {
      if (recipeToToggle.favorite) {
        setLocalRecetas(prev => [recipeToToggle, ...prev]);
      }
    }
  };

  // Pantalla de error si no está autenticado
  if (!session) {
    return (
      <View style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.white
      }}>
        <Text style={[
          globalStyles.text,
          globalStyles.bold,
          { color: colors.red, marginBottom: 10 }
        ]}>
          Error de Autenticación
        </Text>
        <Text style={[
          globalStyles.text,
          { textAlign: 'center', paddingHorizontal: 20 }
        ]}>
          No estás autenticado. Por favor, inicia sesión para continuar.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.screenContainer}
      contentContainerStyle={{ paddingBottom: 20 }}
    >
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Historial y Recetas Guardadas</Text>
        <View style={styles.toggleButtons}>
          {/* Menús a la izquierda */}
          <TouchableOpacity
            style={[
              styles.toggleButton,
              activeTab === 'menus'
                ? styles.activeButton
                : styles.inactiveButton,
              { marginRight: 10 }
            ]}
            onPress={() => setActiveTab('menus')}
          >
            <Text style={[
              styles.toggleButtonText,
              activeTab === 'menus'
                ? styles.activeButtonText
                : styles.inactiveButtonText
            ]}>
              Menús
            </Text>
          </TouchableOpacity>
          {/* Recetas a la derecha */}
          <TouchableOpacity
            style={[
              styles.toggleButton,
              activeTab === 'recipes'
                ? styles.activeButton
                : styles.inactiveButton
            ]}
            onPress={() => setActiveTab('recipes')}
          >
            <Text style={[
              styles.toggleButtonText,
              activeTab === 'recipes'
                ? styles.activeButtonText
                : styles.inactiveButtonText
            ]}>
              Recetas
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* MENUS */}
      {activeTab === 'menus' && (
        <View style={styles.recipesTabContainer}>
          {cargandoMenus && (
            <View style={{ paddingVertical: 30 }}>
              <ActivityIndicator size="large" color={colors.primary} />
            </View>
          )}
          {errorMenus && (
            <Text style={[styles.placeholderText, { color: colors.red }]}>
              {errorMenus.message}
            </Text>
          )}
          {!cargandoMenus && !errorMenus && menus.length === 0 && (
            <Text style={styles.placeholderText}>No tienes menús en tu historial.</Text>
          )}
          {!cargandoMenus && !errorMenus && menus.map((menu) => {
            const mostrarRecetas = menu.recipes.slice(0, 3);
            const hayMas = menu.recipes.length > 3;
            return (
              <View key={menu.menuId} style={styles.menuWeekContainer}>
                <View style={styles.menuWeekHeader}>
                  <FontAwesome5 name="calendar-alt" size={20} color={colors.primary} />
                  <Text style={styles.menuWeekTitle}>{menu.menuDate}</Text>
                </View>
                {mostrarRecetas.map((item, itemIndex) => (
                  <View key={item.id + '-' + itemIndex} style={styles.menuItemContainer}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      {obtenerIconoComida(item.mealType)}
                      <Text style={[styles.menuItemName, { marginLeft: 8 }]}>
                        {ofuscarTitulo(item.title)}
                      </Text>
                    </View>
                    <View style={styles.menuItemTimeContainer}>
                      <FontAwesome5 name="clock" size={14} color={colors.gray} />
                      <Text style={styles.menuItemTime}>{item.prep_time} min</Text>
                    </View>
                  </View>
                ))}
                {hayMas && (
                  <TouchableOpacity
                    style={styles.verMasBoton} // Cambiado de styles.verMasContainer
                    // onPress={() => ...} // Aquí puedes abrir un modal o navegar a la pantalla de detalle del menú
                  >
                    <FontAwesome5 name="plus" size={14} color={colors.white} />
                    <Text style={styles.verMasBotonText}>Ver más recetas</Text>
                  </TouchableOpacity>
                )}
              </View>
            );
          })}
        </View>
      )}

      {/* RECETAS FAVORITAS */}
      {activeTab === 'recipes' && (
        <View style={styles.recipesTabContainer}>
          {cargandoRecetas && (
            <View style={{ paddingVertical: 30 }}>
              <ActivityIndicator size="large" color={colors.primary} />
            </View>
          )}
          {errorRecetas && (
            <Text style={[styles.placeholderText, { color: colors.red }]}>
              {errorRecetas.message}
            </Text>
          )}
          {!cargandoRecetas && !errorRecetas && localRecetas.length === 0 && (
            <Text style={styles.placeholderText}>No tienes recetas guardadas.</Text>
          )}
          {!cargandoRecetas && !errorRecetas && localRecetas.map((recipe) => (
            <TouchableOpacity key={recipe.id} onPress={() => router.push({ pathname: '/receta/[id]', params: { id: recipe.id.toString() } } as any)} activeOpacity={0.7}>
              <View style={styles.recipeCard}>
                <View style={styles.recipeCardHeader}>
                  <View style={styles.recipeTitleContainer}>
                    {obtenerIconoComida(recipe.schedules[0]?.mealType || 'Otro')}
                    <Text style={styles.recipeTitle} numberOfLines={1}>{recipe.title}</Text>
                  </View>
                  <TouchableOpacity
                    style={{
                      width: 40,
                      height: 40,
                      backgroundColor: recipe.favorite ? colors.red : colors.lightRed,
                      borderRadius: 12,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                    onPress={() => handleToggleFavorite(recipe.id)}
                  >
                    <Heart
                      size={24}
                      color={recipe.favorite ? colors.white : colors.red}
                      fill={recipe.favorite ? colors.red : 'none'}
                      strokeWidth={2}
                    />
                  </TouchableOpacity>
                </View>
                <Text style={styles.recipeDescription} numberOfLines={2}>{recipe.description}</Text>
                <View style={styles.recipeInfo}>
                  <View style={styles.infoItem}>
                    <Clock size={16} color={colors.gray} strokeWidth={2} />
                    <Text style={styles.infoText}>{recipe.prep_time} min</Text>
                  </View>
                  <View style={styles.infoItem}>
                    <Users size={16} color={colors.gray} strokeWidth={2} />
                    <Text style={styles.infoText}>{recipe.number_of_servings}</Text>
                  </View>
                  <View style={styles.infoItem}>
                    <ChefHat size={16} color={colors.gray} strokeWidth={2} />
                    <Text style={styles.infoText}>{recipe.difficulty}</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: colors.lighterGray,
    paddingHorizontal: 20,
  },
  headerContainer: {
    paddingTop: 50,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.black,
    marginBottom: 20,
    textAlign: 'center',
  },
  toggleButtons: {
    flexDirection: 'row',
    marginBottom: 25,
    gap: 0,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeButton: {
    backgroundColor: colors.primary,
  },
  inactiveButton: {
    backgroundColor: colors.lightGray,
  },
  toggleButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  activeButtonText: {
    color: colors.white,
  },
  inactiveButtonText: {
    color: colors.gray,
  },
  menuWeekContainer: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    borderWidth: 0.5,
    borderColor: 'rgba(200, 200, 200, 0.5)',
  },
  menuWeekHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  menuWeekTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.black,
    marginLeft: 10,
  },
  menuItemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  menuItemName: {
    fontSize: 16,
    color: colors.black,
  },
  menuItemTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemTime: {
    fontSize: 14,
    color: colors.gray,
    marginLeft: 6,
  },
  verMasContainer: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  verMasText: {
    color: colors.primary,
    fontWeight: 'bold',
    fontSize: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  verMasBoton: { // Nuevo estilo para el botón
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20, // Bordes redondeados para un look de botón
    marginTop: 10, // Espacio arriba
  },
  verMasBotonText: { // Nuevo estilo para el texto del botón
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 15,
    marginLeft: 8, // Espacio entre el icono y el texto
  },
  recipesTabContainer: {},
  recipeCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
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
  placeholderText: {
    fontSize: 16,
    color: colors.gray,
    textAlign: 'center',
    marginTop: 30,
  },
});
