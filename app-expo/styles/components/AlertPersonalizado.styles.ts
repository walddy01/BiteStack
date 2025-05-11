import { StyleSheet } from "react-native";
import { colors } from "../colors";
import { radius, shadow, spacing, typography } from "../globalStyles";

export const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: 'rgba(0, 0, 0, 0.5)', // Eliminado para quitar el fondo semitransparente
  },
  modalView: {
    marginHorizontal: spacing.xl,
    // marginVertical se elimina para centrar mejor con el fondo semitransparente
    width: '80%',
    minHeight: 150, // Usar minHeight para permitir que el contenido crezca
    backgroundColor: colors.white,
    borderRadius: radius.md,
    padding: spacing.xl,
    alignItems: 'center',
    ...shadow.md,
    borderWidth: 2,
    // borderColor se aplica dinámicamente en el componente
  },
  modalText: {
    marginBottom: spacing.lg, // Usar constante de espaciado
    textAlign: 'center',
    color: colors.black,
    fontSize: typography.body1, // Usar constante de tipografía
  },
  button: {
    borderRadius: radius.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    // elevation: 2, // La sombra se elimina para el botón de cerrar del alert
    minWidth: 100,
    alignItems: 'center',
    marginTop: spacing.lg,
    // backgroundColor y borde se aplican dinámicamente en el componente para el botón de cerrar
  },
  buttonText: { // Renombrado de textStyle para mayor claridad
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: typography.body2, // Usar constante de tipografía
    // color se aplica dinámicamente en el componente
  },
});
