// components/SliderRecetas.tsx

import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  ScrollView,
  ViewToken,
} from 'react-native';
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  Users,
  ChefHat,
  Coffee,
  UtensilsCrossed,
  Moon,
} from 'lucide-react-native';
import { colors } from '../utils/colors';
import useObtenerMenuSemana, { DayMenu, Recipe } from '../hooks/useObtenerMenuSemana';

const { width: windowWidth } = Dimensions.get('window');

/** Devuelve el icono según el tipo de comida que viene de la API */
function getMealIcon(mealType: string) {
  switch (mealType) {
    case 'Desayuno':
      return <Coffee size={18} color={colors.primary} strokeWidth={2} />;
    case 'Almuerzo':
      return <UtensilsCrossed size={18} color={colors.primary} strokeWidth={2} />;
    case 'Cena':
      return <Moon size={18} color={colors.primary} strokeWidth={2} />;
    default:
      return <UtensilsCrossed size={18} color={colors.primary} strokeWidth={2} />;
  }
}

/** Nombres de días de la semana */
function getDayName(dateString: string) {
  const days = ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];
  const d = new Date(dateString);
  return days[d.getDay()];
}

export default function SliderRecetas({ userId }: { userId: number }) {
  const { menuData, cargando, error } = useObtenerMenuSemana(userId);
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList<number>>(null);

  // Iniciar en el día correcto al cargar los datos
  useEffect(() => {
    if (!menuData) return;
    const [año, mes, dia] = menuData.menuDate.split('-').map(Number);
    const start = new Date(año, mes - 1, dia);
    const today = new Date();
    const diff = Math.floor((today.getTime() - start.getTime()) / (1000*60*60*24));
    if (diff >= 0 && diff < 7) {
      setCurrentIndex(diff);
      flatListRef.current?.scrollToIndex({ index: diff, animated: false });
    }
  }, [menuData]);

  const displayDayName = useCallback(() => {
    if (!menuData) return '';
    const d = new Date(menuData.menuDate);
    d.setDate(d.getDate() + currentIndex);
    return getDayName(d.toISOString().split('T')[0]);
  }, [menuData, currentIndex]);

  const goToNext = () => {
    if (currentIndex < 6) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1, animated: true });
    }
  };
  const goToPrevious = () => {
    if (currentIndex > 0) {
      flatListRef.current?.scrollToIndex({ index: currentIndex - 1, animated: true });
    }
  };

  const viewabilityConfig = { viewAreaCoveragePercentThreshold: 50 };
  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      const idx = viewableItems[0]?.index;
      if (idx != null) setCurrentIndex(idx);
    },
    []
  );

  const daysArray = useMemo(() => Array.from({ length: 7 }, (_, i) => i), []);

  const renderRecipeCard = (recipe: Recipe, isLast: boolean) => (
    <View key={recipe.id} style={[styles.recipeCard, !isLast && styles.recipeCardMargin]}>
      <View style={styles.recipeHeader}>
        {getMealIcon(recipe.mealType)}
        <Text style={styles.recipeTitle} numberOfLines={1}>{recipe.title}</Text>
      </View>
      <Text style={styles.recipeDescription} numberOfLines={2}>{recipe.description}</Text>
      <View style={styles.recipeInfo}>
        <View style={styles.infoItem}>
          <Clock size={16} color={colors.gray} strokeWidth={2} />
          <Text style={styles.infoText}>{recipe.prep_time}min</Text>
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
    </View>
  );

  const renderDayItem = ({ item: dayIndex }: { item: number }) => {
    if (!menuData) return null;
    const date = new Date(menuData.menuDate);
    date.setDate(date.getDate() + dayIndex);
    const dateString = date.toISOString().split('T')[0];
    const recipesForDay = menuData.recipes.filter(r => r.date === dateString);

    return (
      <View style={styles.dayContainer}>
        <ScrollView contentContainerStyle={styles.recipesContainer}>
          {recipesForDay.map((rec, idx) =>
            renderRecipeCard(rec, idx === recipesForDay.length - 1)
          )}
        </ScrollView>
      </View>
    );
  };

  if (cargando) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Cargando menú...</Text>
      </SafeAreaView>
    );
  }
  if (error) {
    return (
      <SafeAreaView style={styles.centered}>
        <Text style={styles.errorText}>Error al cargar el menú:</Text>
        <Text style={styles.errorTextDetail}>{error.message}</Text>
      </SafeAreaView>
    );
  }
  if (!menuData || menuData.recipes.length === 0) {
    return (
      <SafeAreaView style={styles.centered}>
        <Text style={styles.noDataText}>No hay recetas disponibles para mostrar.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />
      <View style={styles.wrapper}>
        <Text style={styles.mainTitle}>Recetas del Día</Text>
        <View style={styles.header}>
          <TouchableOpacity onPress={goToPrevious} disabled={currentIndex === 0}>
            <ChevronLeft
              size={28}
              color={currentIndex === 0 ? colors.lightGray : colors.primary}
              strokeWidth={2.5}
            />
          </TouchableOpacity>
          <Text style={styles.dayText}>{displayDayName()}</Text>
          <TouchableOpacity onPress={goToNext} disabled={currentIndex === 6}>
            <ChevronRight
              size={28}
              color={currentIndex === 6 ? colors.lightGray : colors.primary}
              strokeWidth={2.5}
            />
          </TouchableOpacity>
        </View>
        <FlatList
          ref={flatListRef}
          data={daysArray}
          keyExtractor={(i) => i.toString()}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          renderItem={renderDayItem}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          getItemLayout={(_, index) => ({
            length: windowWidth,
            offset: windowWidth * index,
            index,
          })}
          bounces={false}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.white },
  wrapper: { flex: 1, backgroundColor: colors.white, paddingBottom: 10 },
  mainTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 5,
    marginLeft: 20,
    color: colors.black,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  dayText: {
    flex: 1,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.black,
  },
  dayContainer: { width: windowWidth, paddingHorizontal: 20 },
  recipesContainer: { paddingVertical: 10 },
  recipeCard: {
    backgroundColor: colors.white,
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 1,
    borderColor: colors.lightGray,
    marginBottom: 20,
  },
  recipeCardMargin: {
    marginBottom: 20,
  },
  recipeHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 12 },
  recipeTitle: { flex: 1, fontSize: 18, fontWeight: '700', color: colors.black },
  recipeDescription: {
    fontSize: 15,
    color: colors.gray,
    lineHeight: 22,
  },
  recipeInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: colors.lightGray,
    paddingTop: 15,
  },
  infoItem: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  infoText: { fontSize: 14, color: colors.gray, fontWeight: '500' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  loadingText: { marginTop: 10, fontSize: 16, color: colors.gray },
  errorText: { fontSize: 18, fontWeight: 'bold', color: '#dc3545', textAlign: 'center' },
  errorTextDetail: { fontSize: 14, color: colors.gray, textAlign: 'center' },
  noDataText: { fontSize: 16, color: colors.gray },
});
