import { Dimensions, StyleSheet } from "react-native";
import { colors } from "../colors";
import { radius, shadow, spacing, typography } from "../globalStyles";

const { width: windowWidth } = Dimensions.get('window');

export const styles = StyleSheet.create({
  safeArea: { 
    flex: 1, 
    backgroundColor: colors.white 
  },
  wrapper: { 
    flex: 1, 
    backgroundColor: colors.white, 
    paddingBottom: spacing.sm // Usar constante de espaciado
  },
  mainTitle: {
    fontSize: 24, // Original: 24, typography.h1 es 28
    fontWeight: 'bold',
    marginTop: spacing.lg, // Usar constante de espaciado
    marginBottom: spacing.xs, // Usar constante de espaciado
    marginLeft: spacing.xl, // Usar constante de espaciado
    color: colors.black,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // Asegurar que los elementos se distribuyan
    paddingHorizontal: spacing.xl, // Usar constante de espaciado
    marginBottom: spacing.sm, // Usar constante de espaciado
  },
  dayText: {
    flex: 1, // Permitir que el texto ocupe el espacio central
    textAlign: 'center',
    fontSize: typography.h2, // Original: 20, typography.h2 es 20 (sin cambio)
    fontWeight: 'bold',
    color: colors.black,
  },
  dayContainer: { 
    width: windowWidth, 
    paddingHorizontal: spacing.xl // Usar constante de espaciado
  },
  recipesContainer: { 
    paddingVertical: spacing.sm // Usar constante de espaciado
  },
  recipeCard: {
    backgroundColor: colors.white,
    borderRadius: radius.lg, // Usar constante de radio
    padding: spacing.xl, // Usar constante de espaciado
    ...shadow.md, // Usar constante de sombra
    borderWidth: 0.5,
    borderColor: 'rgba(200, 200, 200, 0.5)',
    // marginBottom se maneja con recipeCardMargin para el último elemento
  },
  recipeCardMargin: {
    marginBottom: spacing.xl, // Usar constante de espaciado
  },
  recipeHeader: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: spacing.md, // Usar constante de espaciado
    gap: spacing.md // Usar constante de espaciado
  },
  recipeTitle: { 
    flex: 1, 
    fontSize: 18, // Original: 18, typography.body1 es 16
    fontWeight: '700', // Un poco más de peso
    color: colors.black 
  },
  recipeDescription: {
    fontSize: 15, // Original: 15, typography.body2 es 14
    color: colors.gray,
    lineHeight: 15 * 1.4, // Ajustar interlineado al nuevo tamaño (original implícito)
    marginBottom: spacing.md, // Usar constante de espaciado
  },
  recipeInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: colors.lightGray,
    paddingTop: spacing.lg, // Usar constante de espaciado
  },
  infoItem: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: spacing.sm // Usar constante de espaciado
  },
  infoText: { 
    fontSize: typography.body2, // Original: 14, typography.caption es 12. typography.body2 es 14
    color: colors.gray, 
    fontWeight: '500' 
  },
  centered: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    padding: spacing.xl // Usar constante de espaciado
  },
  loadingText: { 
    marginTop: spacing.sm, // Usar constante de espaciado
    fontSize: typography.body1, // Original: 16, typography.body1 es 16 (sin cambio)
    color: colors.gray 
  },
  errorText: { 
    fontSize: 18, // Original: 18, typography.h2 es 20
    fontWeight: 'bold', 
    color: colors.red, // Usar color de la paleta
    textAlign: 'center', 
    marginBottom: spacing.xs // Añadir espacio inferior
  },
  errorTextDetail: { 
    fontSize: typography.body2, // Original: 14, typography.body2 es 14 (sin cambio)
    color: colors.gray, 
    textAlign: 'center' 
  },
  noDataText: { 
    fontSize: typography.body1, // Original: 16, typography.body1 es 16 (sin cambio)
    color: colors.gray 
  },
  // Estilos para los botones de navegación del slider (ChevronLeft, ChevronRight)
  navButton: {
    padding: spacing.xs, // Añadir un poco de padding para facilitar el toque
  }
});
