import React from 'react';
import { useAuth } from "@/hooks/useAuth";
import {
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
  CalendarDays,
  ClipboardList
} from 'lucide-react-native';
import useMarcarFavorito from '../../hooks/useMarcarFavorito';
import useObtenerRecetasFavoritas, { FullRecipe } from '../../hooks/useObtenerRecetasFavoritas';
import useObtenerHistorialMenu from '../../hooks/useObtenerHistorialMenus';
import { useFocusEffect } from '@react-navigation/native';
import { router } from 'expo-router';
import { styles } from '../../styles/tabs/comidas.styles';

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
            <View style={styles.emptyStateContainer}>
              <CalendarDays size={60} color={colors.gray} strokeWidth={1.5} />
              <Text style={styles.emptyStateTitle}>No hay menús en tu historial</Text>
              <Text style={styles.emptyStateSubtitle}>
                Cuando generes un menú, aparecerá aquí.
              </Text>
            </View>
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
                    style={styles.verMasBoton}
                    onPress={() => router.push({ pathname: '/menu/[id]', params: { id: menu.menuId.toString() } } as any)}
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
            <View style={styles.emptyStateContainer}>
              <ClipboardList size={60} color={colors.gray} strokeWidth={1.5} />
              <Text style={styles.emptyStateTitle}>No tienes recetas guardadas</Text>
              <Text style={styles.emptyStateSubtitle}>
                Marca tus recetas favoritas para verlas aquí.
              </Text>
            </View>
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
