import { StyleSheet } from "react-native";
import { colors } from "@/styles/colors";
import { radius, spacing, typography } from "@/styles/globalStyles";

export const styles = StyleSheet.create({
  keyboardAvoidingContainer: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center', // Centrar el contenido del ScrollView
  },
  container: {
    // Quitar flex: 1 de globalStyles.container si lo tiene, o manejar aquí
    // flex: 1, // Si se necesita que ocupe toda la altura disponible dentro del ScrollView
    justifyContent: "center",
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xxl,
    backgroundColor: colors.white,
    alignItems: 'center',
    // marginTop: 'auto', // Puede no ser necesario si scrollContainer ya centra
  },
  logo: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
    marginBottom: spacing.xl,
    borderRadius: radius.lg,
  },
  title: {
    // fontSize y fontWeight se heredan de globalStyles.title si se usa
    // Si no, definir aquí: fontSize: typography.h1, fontWeight: 'bold',
    textAlign: "center",
    marginBottom: spacing.xl,
    color: colors.primary,
    fontSize: typography.h1, // Asegurar que el tamaño sea el esperado
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: colors.lightGray,
    padding: spacing.lg,
    borderRadius: radius.md,
    fontSize: typography.body1,
    marginBottom: spacing.lg,
    borderColor: 'rgba(200, 200, 200, 0.5)',
    borderWidth: 0.5,
    color: colors.black,
    width: '100%',
  },
  button: {
    backgroundColor: colors.primary,
    padding: spacing.lg,
    borderRadius: radius.md,
    alignItems: "center",
    marginBottom: spacing.md,
    width: '100%',
  },
  buttonText: {
    color: colors.white,
    fontSize: typography.body1,
    fontWeight: "bold",
  },
  secondaryButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: colors.primary,
    marginTop: spacing.sm, // Margen superior para separar del botón primario
  },
  secondaryButtonText: {
    color: colors.primary,
    // fontSize y fontWeight se heredan de buttonText si se combinan estilos
    // o definir aquí si es diferente: fontSize: typography.body1, fontWeight: "bold",
  },
  errorText: {
    color: colors.red,
    textAlign: "center",
    marginBottom: spacing.md,
    fontSize: typography.body2,
    width: '100%',
  },
  activityIndicator: {
    // No es necesario marginBottom si el botón que reemplaza ya tiene marginBottom
    // Considerar solo marginTop o ajustar el layout de los botones
    marginVertical: spacing.lg, // Usar marginVertical para espaciado arriba y abajo
  }
});
