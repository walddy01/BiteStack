import { useAuth } from "@/hooks/useAuth";
import {
  Text,
  View,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  FlatList,
} from "react-native";
import { colors } from "../../styles/colors";
import { spacing } from "../../styles/globalStyles"; // Añadir importación de spacing
import { useFocusEffect, router, Stack } from "expo-router";
import React, { useCallback } from "react";
import {
  ListaCompra,
  useObtenerListasCompra,
} from "@/hooks/useObtenerListasCompra";
import {
  ShoppingBag,
  ChevronRight,
  Calendar,
  Package,
} from "lucide-react-native";
import { styles } from '../../styles/tabs/lista.styles';

export default function Lista() {
  const { session } = useAuth();
  const { listasCompra, cargando, error, refetch } = useObtenerListasCompra();

  useFocusEffect(
    useCallback(() => {
      if (session) {
        refetch();
      }
    }, [session, refetch])
  );

  const renderListaItem = ({ item }: { item: ListaCompra }) => (
    <TouchableOpacity
      style={styles.cardContainer}
      onPress={() =>
        router.push({
          pathname: "/lista/[id]",
          params: { id: item.shoppingListId.toString() },
        })
      }
      activeOpacity={0.8}
    >
      {/* Lado izquierdo con icono */}
      <View style={styles.cardLeftSide}>
        <View style={styles.iconCircle}>
          <ShoppingBag size={26} color={colors.primary} strokeWidth={2} />
        </View>
      </View>
      
      {/* Lado derecho con información */}
      <View style={styles.cardRightSide}>
        {/* Título y flecha */}
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Lista de Compra</Text>
          <ChevronRight size={22} color={colors.gray} />
        </View>
        
        {/* Fecha */}
        <View style={styles.dateContainer}>
          <Calendar size={16} color={colors.primary} />
          <Text style={styles.dateText}>{item.date}</Text>
        </View>
        
        {/* Ingredientes */}
        <View style={styles.ingredientsPill}>
          <Package size={14} color={colors.gray} style={{marginRight: 5}} />
          <Text style={styles.ingredientsText}>
            {item.ingredients.length} ingrediente(s)
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  // Aseguramos que listasCompra siempre sea un array
  const listas = Array.isArray(listasCompra) ? listasCompra : [];

  return (
    <ScrollView
      style={styles.screenContainer}
      contentContainerStyle={styles.scrollContentContainer}
    >
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Mis Listas de Compra</Text>
      </View>

      <View style={styles.contentAreaContainer}>
        {!session ? (
          <View style={styles.centeredMessageContent}>
            
            <Text
              style={[
                styles.messageTitle,
                { color: colors.red, marginTop: spacing.md },
              ]}
            >
              Error de Autenticación
            </Text>
            <Text style={styles.messageText}>
              No estás autenticado. Por favor, inicia sesión para continuar.
            </Text>
          </View>
        ) : cargando ? (
          <View style={styles.compactLoadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : error ? (
          <View style={styles.centeredMessageContent}>
            <Text
              style={[
//                 styles.messageTitle,
                { color: colors.red, marginVertical: spacing.md },
              ]}
            >
              Error al cargar las listas
            </Text>
            <Text style={styles.messageText}>{error}</Text>
          </View>
        ) : listas.length === 0 ? (
          <View style={styles.centeredMessageContent}>
            <ShoppingBag size={60} color={colors.gray} strokeWidth={1.5} />
            <Text style={styles.emptyListTitle}>No hay listas de compra</Text>
            <Text style={styles.emptyListSubtitle}>
              Parece que aún no tienes ninguna lista de compra generada.
            </Text>
          </View>
        ) : (
          <FlatList
            data={listas}
            renderItem={renderListaItem}
            keyExtractor={(item) => item.shoppingListId.toString()}
            contentContainerStyle={styles.listContainer}
            scrollEnabled={false}
          />
        )}
      </View>
    </ScrollView>
  );
}