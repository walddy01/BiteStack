import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { colors } from "../../styles/colors";
import {
  radius,
  shadow,
  spacing,
  typography,
} from "../../styles/globalStyles";
import {
  useObtenerListasCompra,
  ListaCompra,
  Ingrediente,
} from "@/hooks/useObtenerListasCompra";
import { useAlternarAdquiridoIngrediente } from "@/hooks/useAlternarAdquiridoIngrediente";
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Circle,
  AlertTriangle,
} from "lucide-react-native";
import { useAuth } from "@/hooks/useAuth";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ListaDetalleScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { session } = useAuth();
  const {
    listasCompra,
    cargando: cargandoListas,
    error: errorListas,
    refetch,
  } = useObtenerListasCompra();
  const { alternarAdquirido } = useAlternarAdquiridoIngrediente();

  const listas = Array.isArray(listasCompra) ? listasCompra : [];
  const listaActual = listas.find(
    (l) => l.shoppingListId.toString() === id
  ) || null;

  // Estado local para ingredientes
  const [ingredientes, setIngredientes] = useState<Ingrediente[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    setIngredientes(listaActual?.ingredients || []);
  }, [listaActual]);

  // Optimistic update mejorado (sin icono de carga)
  const handleToggleAdquirido = async (idIngrediente: number) => {
    setErrorMsg(null);
    setIngredientes((prev) =>
      prev.map((ing) =>
        ing.id === idIngrediente
          ? { ...ing, acquired: !ing.acquired }
          : ing
      )
    );
    const ok = await alternarAdquirido(listaActual!.shoppingListId, idIngrediente);
    if (!ok) {
      // Rollback solo ese ingrediente
      setIngredientes((prev) =>
        prev.map((ing) =>
          ing.id === idIngrediente
            ? { ...ing, acquired: !ing.acquired }
            : ing
        )
      );
      setErrorMsg("No se pudo actualizar el ingrediente.");
    }
  };

  if (!session) {
    return (
      <SafeAreaView style={styles.safeAreaContainer}>
        <View style={[styles.contentLoadingErrorContainer, styles.centered]}>
          <AlertTriangle size={48} color={colors.red} />
          <Text
            style={[
              styles.text,
              styles.bold,
              {
                color: colors.red,
                marginTop: spacing.sm,
                textAlign: "center",
              },
            ]}
          >
            Error de Autenticación
          </Text>
          <Text
            style={[
              styles.text,
              { textAlign: "center", marginTop: spacing.md },
            ]}
          >
            No estás autenticado. Por favor, inicia sesión para continuar.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (cargandoListas) {
    return (
      <SafeAreaView style={styles.safeAreaContainer}>
        <View style={[styles.contentLoadingErrorContainer, styles.centered]}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.text, { marginTop: spacing.md }]}>
            Cargando lista...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (errorListas) {
    return (
      <SafeAreaView style={styles.safeAreaContainer}>
        <View style={[styles.contentLoadingErrorContainer, styles.centered]}>
          <AlertTriangle size={48} color={colors.red} />
          <Text
            style={[
              styles.text,
              styles.bold,
              { color: colors.red, textAlign: "center" },
            ]}
          >
            Error al cargar la lista
          </Text>
          <Text
            style={[
              styles.text,
              { textAlign: "center", marginTop: 10 },
            ]}
          >
            {errorListas}
          </Text>
          <TouchableOpacity
            style={[styles.button, { marginTop: spacing.lg }]}
            onPress={refetch}
          >
            <Text style={styles.buttonText}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (!listaActual) {
    return (
      <SafeAreaView style={styles.safeAreaContainer}>
        <View style={[styles.contentLoadingErrorContainer, styles.centered]}>
          <Text style={[styles.text, styles.bold]}>
            Lista no encontrada
          </Text>
          <TouchableOpacity
            style={[styles.button, { marginTop: spacing.lg }]}
            onPress={router.back}
          >
            <Text style={styles.buttonText}>Volver</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Progreso
  const total = ingredientes.length;
  const comprados = ingredientes.filter((i) => i.acquired).length;
  const pendientes = total - comprados;
  const progreso = total ? (comprados / total) * 100 : 0;

  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <ScrollView
        style={styles.scrollViewContainer}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <View style={styles.header}>
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={router.back}
            >
              <ArrowLeft size={24} color={colors.black} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.dateContainer}>
          <Calendar
            size={24}
            color={colors.primary}
            strokeWidth={2}
          />
          <Text style={styles.dateText}>
            Semana del: {listaActual.date}
          </Text>
        </View>

        {errorMsg && (
          <View style={styles.errorContainer}>
            <AlertTriangle size={24} color={colors.red} />
            <Text style={[styles.text, { color: colors.red }]}>
              {errorMsg}
            </Text>
          </View>
        )}

        <View style={styles.progressContainer}>
          <View style={styles.progressTextContainer}>
            <Text style={styles.progressMainText}>
              {pendientes} de {total} pendientes
            </Text>
            <Text style={styles.progressSubText}>
              {comprados} ingredientes comprados
            </Text>
          </View>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${progreso}%` },
              ]}
            />
          </View>
        </View>

        <View style={styles.ingredientsContainer}>
          <Text style={styles.sectionTitle}>Ingredientes</Text>
          <View style={styles.ingredientsList}>
            {ingredientes
              .sort((a, b) => {
                if (a.acquired === b.acquired) {
                  return a.name.localeCompare(b.name);
                }
                return a.acquired ? 1 : -1;
              })
              .map((ingrediente) => (
                <TouchableOpacity
                  key={ingrediente.id}
                  style={[
                    styles.ingredientItem,
                    ingrediente.acquired &&
                      styles.ingredientItemAcquired,
                  ]}
                  onPress={() =>
                    handleToggleAdquirido(ingrediente.id)
                  }
                  activeOpacity={0.7}
                >
                  {ingrediente.acquired ? (
                    <CheckCircle2
                      size={24}
                      color={colors.primary}
                      strokeWidth={2}
                    />
                  ) : (
                    <Circle
                      size={24}
                      color={colors.gray}
                      strokeWidth={2}
                    />
                  )}
                  <Text
                    style={[
                      styles.ingredientName,
                      ingrediente.acquired &&
                        styles.ingredientNameAcquired,
                    ]}
                  >
                    {ingrediente.name}
                  </Text>
                </TouchableOpacity>
              ))}
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
  contentLoadingErrorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.xl,
    backgroundColor: colors.white,
  },
  centered: {
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: typography.body1,
    color: colors.black,
  },
  bold: {
    fontWeight: "bold",
  },
  header: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
  },
  headerActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  backButton: {
    width: 40,
    height: 40,
    backgroundColor: colors.lighterGray,
    borderRadius: radius.lg,
    justifyContent: "center",
    alignItems: "center",
  },
  listHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.lg,
    gap: spacing.md,
  },
  listTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.black,
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.lighterGray,
    marginHorizontal: spacing.xl,
    marginBottom: spacing.xl,
    padding: spacing.lg,
    borderRadius: radius.lg,
    gap: spacing.md,
    ...shadow.sm,
  },
  dateText: {
    fontSize: typography.h2,
    fontWeight: "600",
    color: colors.primary,
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.lightRed,
    marginHorizontal: spacing.xl,
    marginBottom: spacing.xl,
    padding: spacing.lg,
    borderRadius: radius.lg,
    gap: spacing.md,
  },
  progressContainer: {
    marginHorizontal: spacing.xl,
    marginBottom: spacing.xl,
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: spacing.lg,
    ...shadow.sm,
    borderWidth: 0.5,
    borderColor: "rgba(200, 200, 200, 0.5)",
  },
  progressTextContainer: {
    marginBottom: spacing.md,
  },
  progressMainText: {
    fontSize: typography.h2,
    fontWeight: "600",
    color: colors.black,
    marginBottom: spacing.xs,
  },
  progressSubText: {
    fontSize: typography.body2,
    color: colors.gray,
  },
  progressBar: {
    height: 8,
    backgroundColor: colors.lighterGray,
    borderRadius: radius.lg,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: colors.primary,
    borderRadius: radius.lg,
  },
  sectionTitle: {
    fontSize: typography.h2,
    fontWeight: "600",
    color: colors.black,
    marginBottom: spacing.md,
  },
  ingredientsContainer: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxl,
  },
  ingredientsList: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: spacing.lg,
    ...shadow.sm,
    borderWidth: 0.5,
    borderColor: "rgba(200, 200, 200, 0.5)",
    gap: spacing.sm,
  },
  ingredientItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.md,
    backgroundColor: colors.white,
    borderRadius: radius.md,
    gap: spacing.md,
  },
  ingredientItemAcquired: {
    backgroundColor: colors.lighterGray,
  },
  ingredientName: {
    fontSize: typography.body1,
    color: colors.black,
    flex: 1,
  },
  ingredientNameAcquired: {
    color: colors.gray,
    textDecorationLine: "line-through",
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: radius.md,
    alignItems: "center",
  },
  buttonText: {
    color: colors.white,
    fontSize: typography.body1,
    fontWeight: "bold",
  },
});