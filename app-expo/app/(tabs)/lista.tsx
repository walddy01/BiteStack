import { useAuth } from "@/hooks/useAuth";
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  FlatList,
} from "react-native";
import { colors } from "../../styles/colors";
import {
  radius,
  spacing,
  typography,
  shadow,
} from "../../styles/globalStyles";
import { useFocusEffect, router, Stack } from "expo-router";
import React, { useCallback } from "react";
import {
  ListaCompra,
  useObtenerListasCompra,
} from "@/hooks/useObtenerListasCompra";
import {
  ShoppingBag,
  ChevronRight,
  AlertTriangle,
  Calendar,
  Package,
} from "lucide-react-native";

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
            <AlertTriangle size={48} color={colors.red} />
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
            <AlertTriangle size={48} color={colors.red} />
            <Text
              style={[
                styles.messageTitle,
                { color: colors.red, marginVertical: spacing.md },
              ]}
            >
              Error al cargar las listas
            </Text>
            <Text style={styles.messageText}>{error}</Text>
            <TouchableOpacity
              onPress={() => refetch()}
              style={[
                styles.button,
                { marginTop: spacing.lg, backgroundColor: colors.primary },
              ]}
            >
              <Text style={styles.buttonText}>Reintentar</Text>
            </TouchableOpacity>
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

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: colors.lighterGray,
    paddingHorizontal: 20,
  },
  scrollContentContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  headerContainer: {
    paddingTop: 50,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.black,
    marginBottom: 20,
    textAlign: "center",
  },
  listContainer: {
    paddingBottom: 10,
  },
  cardContainer: {
    flexDirection: "row",
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    marginBottom: spacing.xl,
    overflow: "hidden",
    borderWidth: 0.5,
    borderColor: "rgba(200, 200, 200, 0.5)",
    ...shadow.sm,
  },
  cardLeftSide: {
    width: 70,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.white,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.lighterGray,
    justifyContent: "center",
    alignItems: "center",
  },
  cardRightSide: {
    flex: 1,
    padding: 15,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.black,
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  dateText: {
    color: colors.primary,
    fontWeight: "600",
    fontSize: 15,
    marginLeft: 8,
  },
  ingredientsPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.lighterGray,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: "flex-start",
  },
  ingredientsText: {
    fontSize: 14,
    color: colors.gray,
    fontWeight: "500",
  },
  contentAreaContainer: {
    flex: 1,
  },
  compactLoadingContainer: {
    paddingVertical: 30,
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  centeredMessageContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.lg,
    minHeight: 250,
  },
  messageTitle: {
    fontSize: typography.h2,
    fontWeight: "bold",
    textAlign: "center",
    color: colors.black,
  },
  messageText: {
    fontSize: typography.body1,
    color: colors.gray,
    textAlign: "center",
    marginTop: spacing.sm,
    lineHeight: typography.body1 * 1.5,
  },
  emptyListTitle: {
    fontSize: typography.h2,
    fontWeight: "600",
    color: colors.black,
    marginTop: spacing.lg,
    textAlign: "center",
  },
  emptyListSubtitle: {
    fontSize: typography.body1,
    color: colors.gray,
    textAlign: "center",
    marginTop: spacing.sm,
    paddingHorizontal: spacing.lg,
    lineHeight: typography.body1 * 1.5,
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md + 2,
    paddingHorizontal: spacing.xl + 5,
    borderRadius: radius.md,
    alignItems: "center",
    minWidth: 180,
    ...shadow.sm,
  },
  buttonText: {
    color: colors.white,
    fontSize: typography.body1,
    fontWeight: "bold",
  },
});