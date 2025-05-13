import { router } from 'expo-router'
import {
  ChefHat,
  ChevronLeft,
  ChevronRight,
  Clock,
  Coffee,
  Moon,
  Users,
  UtensilsCrossed,
} from 'lucide-react-native'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
  ViewToken,
} from 'react-native'
import { colors } from '../styles/colors'
import { DayMenu, Recipe } from '../hooks/useObtenerMenuSemana'
import { styles as componentStyles } from '../styles/components/SliderRecetas.styles'
import { styles as globalStyles } from '../styles/globalStyles'


function obtenerIconoComida(tipoComida: string) {
  switch (tipoComida) {
    case 'Desayuno':
      return <Coffee size={18} color={colors.primary} strokeWidth={2} />
    case 'Almuerzo':
      return <UtensilsCrossed size={18} color={colors.primary} strokeWidth={2} />
    case 'Cena':
      return <Moon size={18} color={colors.primary} strokeWidth={2} />
    default:
      return <UtensilsCrossed size={18} color={colors.primary} strokeWidth={2} />
  }
}

function obtenerNombreDia(cadenaFecha: string) {
  const dias = ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado']
  const d = new Date(cadenaFecha)
  return dias[d.getDay()]
}

export default function SliderRecetas({
  menuData,
  cargandoMenu,
  errorMenu,
}: {
  menuData: DayMenu | null
  cargandoMenu: boolean
  errorMenu: Error | null
}) {
  const [indiceActual, setIndiceActual] = useState(0)
  const flatListRef = useRef<FlatList<number>>(null)

  useEffect(() => {
    if (!menuData) return
    const [año, mes, dia] = menuData.menuDate.split('-').map(Number)
    const inicioSemana = new Date(año, mes - 1, dia)
    const hoy = new Date()
    const diff = Math.max(0, Math.floor((hoy.getTime() - inicioSemana.getTime()) / (1000 * 60 * 60 * 24)))
    if (diff < 7) {
      setIndiceActual(diff)
      setTimeout(() => flatListRef.current?.scrollToIndex({ index: diff, animated: false }), 0);
    }
  }, [menuData])

  const mostrarNombreDia = useCallback(() => {
    if (!menuData) return ''
    const fecha = new Date(menuData.menuDate)
    fecha.setDate(fecha.getDate() + indiceActual)
    return obtenerNombreDia(fecha.toISOString().split('T')[0])
  }, [menuData, indiceActual])

  const irSiguiente = () => {
    if (indiceActual < 6) {
      flatListRef.current?.scrollToIndex({ index: indiceActual + 1, animated: true })
    }
  }
  const irAnterior = () => {
    if (indiceActual > 0) {
      flatListRef.current?.scrollToIndex({ index: indiceActual - 1, animated: true })
    }
  }

  const configuracionVisibilidad = { viewAreaCoveragePercentThreshold: 50 }
  const alCambiar = useCallback(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    const idx = viewableItems[0]?.index
    if (idx != null && idx !== indiceActual) {
        setIndiceActual(idx)
    }
  }, [indiceActual])

  const arrayDias = useMemo(() => Array.from({ length: 7 }, (_, i) => i), [])

  const renderTarjeta = (receta: Recipe, esUltima: boolean) => (
    <TouchableOpacity
      key={receta.id}
      style={[componentStyles.recipeCard]}
      activeOpacity={0.7}
      onPress={() => router.push({ pathname: '/receta/[id]', params: { id: receta.id.toString() } } as any)}
    >
      <View style={componentStyles.recipeHeader}>
        {obtenerIconoComida(receta.mealType)}
        <Text style={componentStyles.recipeTitle} numberOfLines={1}>{receta.title}</Text>
      </View>
      <Text style={componentStyles.recipeDescription} numberOfLines={2}>{receta.description}</Text>
      <View style={componentStyles.recipeInfo}>
        <View style={componentStyles.infoItem}>
          <Clock size={16} color={colors.gray} strokeWidth={2} />
          <Text style={componentStyles.infoText}>{receta.prep_time}min</Text>
        </View>
        <View style={componentStyles.infoItem}>
          <Users size={16} color={colors.gray} strokeWidth={2} />
          <Text style={componentStyles.infoText}>{receta.servings}</Text>
        </View>
        <View style={componentStyles.infoItem}>
          <ChefHat size={16} color={colors.gray} strokeWidth={2} />
          <Text style={componentStyles.infoText}>{receta.difficulty}</Text>
        </View>
      </View>
    </TouchableOpacity>
  )

  const renderDia = ({ item: i }: { item: number }) => {
    if (!menuData) return null
    const fecha = new Date(menuData.menuDate)
    fecha.setDate(fecha.getDate() + i)
    const cadena = fecha.toISOString().split('T')[0]
    const recetas = menuData.recipes.filter(r => r.date === cadena)
    return (
      <View style={componentStyles.dayContainer}>
        {recetas.length > 0 ? (
          <ScrollView contentContainerStyle={componentStyles.recipesContainer} showsVerticalScrollIndicator={false}>
            {recetas.map((r, idx) => renderTarjeta(r, idx === recetas.length - 1))}
          </ScrollView>
        ) : (
          <View style={componentStyles.centered}>
            <Text style={globalStyles.text}>No hay recetas programadas para este día.</Text>
          </View>
        )}
      </View>
    )
  }

  if (cargandoMenu) {
    return (
      <SafeAreaView style={componentStyles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={componentStyles.loadingText}>Cargando menú...</Text>
      </SafeAreaView>
    )
  }
  if (errorMenu) {
    return (
      <SafeAreaView style={componentStyles.centered}>
        <Text style={componentStyles.errorText}>Error al cargar el menú:</Text>
        <Text style={componentStyles.errorTextDetail}>{errorMenu.message}</Text>
      </SafeAreaView>
    )
  }
  if (!menuData || menuData.recipes.length === 0) {
    return (
      <SafeAreaView style={componentStyles.centered}>
        <Text style={componentStyles.noDataText}>No hay recetas disponibles para mostrar.</Text>
      </SafeAreaView>
    )
  }

  const windowWidth = Dimensions.get('window').width;

  return (
    <SafeAreaView style={componentStyles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />
      <View style={componentStyles.wrapper}>
        <Text style={componentStyles.mainTitle}>Recetas del Día</Text>
        <View style={componentStyles.header}>
          <TouchableOpacity onPress={irAnterior} disabled={indiceActual === 0} style={componentStyles.navButton}>
            <ChevronLeft size={28} color={indiceActual === 0 ? colors.lightGray : colors.primary} strokeWidth={2.5} />
          </TouchableOpacity>
          <Text style={componentStyles.dayText}>{mostrarNombreDia()}</Text>
          <TouchableOpacity onPress={irSiguiente} disabled={indiceActual === 6} style={componentStyles.navButton}>
            <ChevronRight size={28} color={indiceActual === 6 ? colors.lightGray : colors.primary} strokeWidth={2.5} />
          </TouchableOpacity>
        </View>
        <FlatList
          ref={flatListRef}
          data={arrayDias}
          keyExtractor={i => i.toString()}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          renderItem={renderDia}
          onViewableItemsChanged={alCambiar}
          viewabilityConfig={configuracionVisibilidad}
          initialScrollIndex={indiceActual}
          getItemLayout={(_, index) => ({
            length: windowWidth,
            offset: windowWidth * index,
            index,
          })}
          bounces={false}
        />
      </View>
    </SafeAreaView>
  )
}
