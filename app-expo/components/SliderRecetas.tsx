import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { ChevronLeft, ChevronRight, Clock, Users, ChefHat } from 'lucide-react-native';
import { colors } from '../utils/colors';

interface Recipe {
  id: string;
  day: string;
  title: string;
  description: string;
  time: string;
  servings: string;
  difficulty: string;
  imageUrl: string;
}

function SliderRecetas() {
  const RECIPES_DATA: Recipe[] = [
    { id: '0', day: 'Lunes', title: 'Sopa de Lentejas', description: 'Sopa nutritiva de lentejas con verduras frescas y especias.', time: '45 min', servings: '4 personas', difficulty: 'Fácil', imageUrl: 'https://via.placeholder.com/400x200/FFE4E1/000000?text=Sopa+de+Lentejas' },
    { id: '1', day: 'Martes', title: 'Pasta Primavera', description: 'Deliciosa pasta con verduras frescas y salsa de tomate casera.', time: '30 min', servings: '4 personas', difficulty: 'Fácil', imageUrl: 'https://via.placeholder.com/400x200/FFDEAD/000000?text=Pasta+Primavera' },
    { id: '2', day: 'Miércoles', title: 'Ensalada César', description: 'Clásica ensalada César con pollo a la parrilla, crutones caseros y aderezo cremoso.', time: '20 min', servings: '2 personas', difficulty: 'Fácil', imageUrl: 'https://via.placeholder.com/400x200/FFC0CB/000000?text=Ensalada+Cesar' },
    { id: '3', day: 'Jueves', title: 'Bowl Buddha', description: 'Bowl vegetariano lleno de nutrientes con quinoa, garbanzos asados, aguacate y vegetales de temporada.', time: '25 min', servings: '2 personas', difficulty: 'Fácil', imageUrl: 'https://via.placeholder.com/400x200/ADD8E6/000000?text=Bowl+Buddha' },
    { id: '4', day: 'Viernes', title: 'Tacos de Pescado', description: 'Deliciosos tacos de pescado estilo Baja con repollo rallado, salsa cremosa y un toque de lima.', time: '30 min', servings: '3 personas', difficulty: 'Medio', imageUrl: 'https://via.placeholder.com/400x200/90EE90/000000?text=Tacos+Pescado' },
  ];

  const initialIndex = RECIPES_DATA.findIndex(recipe => recipe.day === 'Jueves') || 0;
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const flatListRef = useRef<FlatList<Recipe>>(null);

  const viewabilityConfig = { viewAreaCoveragePercentThreshold: 50 };

  const onViewableItemsChanged = useCallback(({ viewableItems }: { viewableItems: any[] }) => {
    if (viewableItems.length > 0 && viewableItems[0].index != null) {
      setCurrentIndex(viewableItems[0].index);
    }
  }, []);

  const goToNext = () => {
    if (currentIndex < RECIPES_DATA.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1, animated: true });
    }
  };

  const goToPrevious = () => {
    if (currentIndex > 0) {
      flatListRef.current?.scrollToIndex({ index: currentIndex - 1, animated: true });
    }
  };

  const getItemLayout = (_: any, index: number) => {
    const windowWidth = Dimensions.get('window').width;
    return { length: windowWidth, offset: windowWidth * index, index };
  };

  const renderItem = ({ item }: { item: Recipe }) => {
    const windowWidth = Dimensions.get('window').width;
    const cardWidth = windowWidth * 0.9;
    const fixedCardHeight = 350;

    return (
      <View style={{ width: windowWidth, alignItems: 'center', justifyContent: 'center', paddingVertical: 10 }}>
        <View style={[styles.cardContainer, { width: cardWidth, height: fixedCardHeight }]}>
          <Image source={{ uri: item.imageUrl }} style={styles.cardImage} />
          <View style={styles.cardContentContainer}>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardDescription} numberOfLines={2} ellipsizeMode="tail">
              {item.description}
            </Text>
            <View style={styles.cardInfoRow}>
              <View style={styles.cardInfoItem}>
                <Clock size={18} color={colors.gray} strokeWidth={2} />
                <Text style={styles.cardInfoText}>{item.time}</Text>
              </View>
              <View style={styles.cardInfoItem}>
                <Users size={18} color={colors.gray} strokeWidth={2} />
                <Text style={styles.cardInfoText}>{item.servings}</Text>
              </View>
              <View style={styles.cardInfoItem}>
                <ChefHat size={18} color={colors.gray} strokeWidth={2} />
                <Text style={styles.cardInfoText}>{item.difficulty}</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  };

  const currentRecipe = RECIPES_DATA[currentIndex];

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />
      <View style={styles.wrapper}>
        <Text style={styles.mainTitle}>Receta de Hoy</Text>
        <View style={styles.header}>
          <TouchableOpacity onPress={goToPrevious} disabled={currentIndex === 0} style={styles.arrowButton}>
            <ChevronLeft size={28} color={currentIndex === 0 ? colors.lightGray : colors.primary} strokeWidth={2.5} />
          </TouchableOpacity>
          <Text style={styles.dayText}>{currentRecipe.day}</Text>
          <TouchableOpacity onPress={goToNext} disabled={currentIndex === RECIPES_DATA.length - 1} style={styles.arrowButton}>
            <ChevronRight size={28} color={currentIndex === RECIPES_DATA.length - 1 ? colors.lightGray : colors.primary} strokeWidth={2.5} />
          </TouchableOpacity>
        </View>
        
        <FlatList
          ref={flatListRef}
          data={RECIPES_DATA}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          initialScrollIndex={initialIndex}
          getItemLayout={getItemLayout}
          style={styles.flatList}
          bounces={false}
        />
      </View>
    </SafeAreaView>
  );
}

const { width: windowWidth } = Dimensions.get('window');

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },
  wrapper: {
    flex: 1,
    backgroundColor: colors.white,
    paddingBottom: 10,
  },
  mainTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 5,
    marginLeft: 20,
    color: colors.black,
    alignSelf: 'flex-start',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: windowWidth * 0.05,
    marginBottom: 5,
    marginTop: 10,
  },
  dayText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.black,
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 10,
  },
  arrowButton: {
    padding: 5,
  },
  flatList: {
    flexGrow: 0,
  },
  cardContainer: {
    backgroundColor: colors.white,
    borderRadius: 15,
    overflow: 'hidden',
    boxShadow: '0 1px 1px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.08)',
    elevation: 1, // Android
  },
  cardImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  cardContentContainer: {
    padding: 15,
    flex: 1,
    justifyContent: 'space-between',
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
    color: colors.black,
  },
  cardDescription: {
    fontSize: 14,
    color: colors.gray,
    marginBottom: 15,
    lineHeight: 20,
  },
  cardInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.lightGray,
    paddingTop: 10,
    marginTop: 10,
  },
  cardInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1,
    marginRight: 5,
  },
  cardInfoText: {
    marginLeft: 6,
    fontSize: 14,
    color: colors.gray,
    flexShrink: 1,
  },
});

export default SliderRecetas;
