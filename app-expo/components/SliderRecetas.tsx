import { router } from 'expo-router';
import {
  ChefHat,
  ChevronLeft,
  ChevronRight,
  Clock,
  Coffee,
  Moon,
  Users,
  UtensilsCrossed,
} from 'lucide-react-native';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewToken,
} from 'react-native';
import useObtenerMenuSemana, { Recipe } from '../hooks/useObtenerMenuSemana'; // DayMenu
import { colors } from '../utils/colors';

const { width: windowWidth } = Dimensions.get('window');

/** Icono según tipo de comida */
function obtenerIconoComida(tipoComida: string) {
  switch (tipoComida) {
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

function obtenerNombreDia(cadenaFecha: string) {
  const dias = ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];
  const d = new Date(cadenaFecha);
  return dias[d.getDay()];
}

export default function SliderRecetas({ userId, recargarRecetas }: { userId: number, recargarRecetas?: number }) {
  const { menuData, cargando, error } = useObtenerMenuSemana(userId, recargarRecetas);
  const [indiceActual, setIndiceActual] = useState(0);
  const flatListRef = useRef<FlatList<number>>(null);

  // Inicializar el índice actual al cargar el menú
  useEffect(() => {
    if (!menuData) return;
    const [año, mes, dia] = menuData.menuDate.split('-').map(Number);
    const inicioSemana = new Date(año, mes - 1, dia);
    const hoy = new Date();
    const diferenciaDias = Math.floor((hoy.getTime() - inicioSemana.getTime()) / (1000*60*60*24));
    if (diferenciaDias >= 0 && diferenciaDias < 7) {
      setIndiceActual(diferenciaDias);
      flatListRef.current?.scrollToIndex({ index: diferenciaDias, animated: false });
    }
  }, [menuData]);

  const mostrarNombreDia = useCallback(() => {
    if (!menuData) return '';
    const fechaActual = new Date(menuData.menuDate);
    fechaActual.setDate(fechaActual.getDate() + indiceActual);
    return obtenerNombreDia(fechaActual.toISOString().split('T')[0]);
  }, [menuData, indiceActual]);

  const irSiguiente = () => {
    if (indiceActual < 6) {
      flatListRef.current?.scrollToIndex({ index: indiceActual + 1, animated: true });
    }
  };
  const irAnterior = () => {
    if (indiceActual > 0) {
      flatListRef.current?.scrollToIndex({ index: indiceActual - 1, animated: true });
    }
  };

  const configuracionVisibilidad = { viewAreaCoveragePercentThreshold: 50 };
  const alCambiarElementosVisibles = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      const idx = viewableItems[0]?.index;
      if (idx != null) setIndiceActual(idx);
    },
    []
  );

  const arrayDias = useMemo(() => Array.from({ length: 7 }, (_, i) => i), []);

  const renderizarTarjetaReceta = (receta: Recipe, esUltima: boolean) => (
    <TouchableOpacity
      activeOpacity={0.7}
      key={receta.id}
      style={[styles.recipeCard, !esUltima && styles.recipeCardMargin]}
      onPress={() => {
        const id = receta.id.toString();
        router.push({
          pathname: "/receta/[id]",
          params: { id }
        } as any);
      }}
    >
      <View style={styles.recipeHeader}>
        {obtenerIconoComida(receta.mealType)}
        <Text style={styles.recipeTitle} numberOfLines={1}>{receta.title}</Text>
      </View>
      <Text style={styles.recipeDescription} numberOfLines={2}>{receta.description}</Text>
      <View style={styles.recipeInfo}>
        <View style={styles.infoItem}>
          <Clock size={16} color={colors.gray} strokeWidth={2} />
          <Text style={styles.infoText}>{receta.prep_time}min</Text>
        </View>
        <View style={styles.infoItem}>
          <Users size={16} color={colors.gray} strokeWidth={2} />
          <Text style={styles.infoText}>{receta.servings}</Text>
        </View>
        <View style={styles.infoItem}>
          <ChefHat size={16} color={colors.gray} strokeWidth={2} />
          <Text style={styles.infoText}>{receta.difficulty}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderizarElementoDia = ({ item: indiceDia }: { item: number }) => {
    if (!menuData) return null;
    const fecha = new Date(menuData.menuDate);
    fecha.setDate(fecha.getDate() + indiceDia);
    const cadenaFecha = fecha.toISOString().split('T')[0];
    const recetasParaDia = menuData.recipes.filter(r => r.date === cadenaFecha);

    return (
      <View style={styles.dayContainer}>
        <ScrollView contentContainerStyle={styles.recipesContainer}>
          {recetasParaDia.map((rec, idx) =>
            renderizarTarjetaReceta(rec, idx === recetasParaDia.length - 1)
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
          <TouchableOpacity onPress={irAnterior} disabled={indiceActual === 0}>
            <ChevronLeft
              size={28}
              color={indiceActual === 0 ? colors.lightGray : colors.primary}
              strokeWidth={2.5}
            />
          </TouchableOpacity>
          <Text style={styles.dayText}>{mostrarNombreDia()}</Text>
          <TouchableOpacity onPress={irSiguiente} disabled={indiceActual === 6}>
            <ChevronRight
              size={28}
              color={indiceActual === 6 ? colors.lightGray : colors.primary}
              strokeWidth={2.5}
            />
          </TouchableOpacity>
        </View>
        <FlatList
          ref={flatListRef}
          data={arrayDias}
          keyExtractor={(i) => i.toString()}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          renderItem={renderizarElementoDia}
          onViewableItemsChanged={alCambiarElementosVisibles}
          viewabilityConfig={configuracionVisibilidad}
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
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 3,
    borderWidth: 0.5,
    borderColor: 'rgba(200, 200, 200, 0.5)',
    marginBottom: 0,
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
    marginBottom: 12,
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