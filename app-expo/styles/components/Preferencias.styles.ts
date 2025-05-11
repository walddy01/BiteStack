import { StyleSheet } from "react-native";
import { colors } from "../colors"; // Corregido: la ruta a colors es un nivel arriba
import { radius, shadow, spacing, typography } from "../globalStyles"; // Corregido: la ruta a globalStyles es un nivel arriba

export const styles = StyleSheet.create({
  preferencesCard: {
    margin: spacing.xl,
    padding: spacing.xl,
    borderRadius: radius.md,
    backgroundColor: colors.lighterGray,
    ...shadow.md,
    borderWidth: 0.5,
    borderColor: 'rgba(200, 200, 200, 0.5)',
  },
  preferencesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.lg,
    minHeight: 33,
  },
  cancelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.lightRed,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.lg,
    minHeight: 33,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.green,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.lg,
    minHeight: 33,
  },
  preferencesDetails: {
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  preferenceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
    alignItems: 'center', 
  },
  preferenceLabel: {
    // Los estilos de texto base (como fontSize, fontFamily si se define globalmente) 
    // y color específico se aplicarán en el componente Preferencias.tsx
    // usando los estilos globales de texto y el color de globalStyles o colors.ts.
    // Ejemplo: <Text style={[globalStyles.text, localStyles.preferenceLabel, {color: colors.gray}]}>Label</Text>
    marginRight: spacing.sm,
  },
  preferenceValue: {
    // Similar a preferenceLabel, los estilos de texto base se toman de globalStyles.
    // Propiedades específicas como fontWeight, flexShrink, textAlign se mantienen aquí.
    fontWeight: '500',
    flexShrink: 1, // Permite que el texto se ajuste si es muy largo
    textAlign: 'right',
  },
  preferenceInput: {
    flex: 1, // Ocupa el espacio disponible
    height: 36, // Altura fija para inputs
    maxWidth: '60%', // Limita el ancho máximo
    backgroundColor: colors.white,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    ...shadow.md, // Sombra sutil
    borderWidth: 0.5,
    borderColor: 'rgba(200, 200, 200, 0.5)', // Borde ligero
    fontSize: typography.body2, // Tamaño de fuente consistente
    color: colors.black, // Color de texto
  },
  textAreaContainer: {
    flexDirection: 'column', // Para que label y textarea estén uno encima del otro
    alignItems: 'flex-start', // Alinea el label al inicio
    gap: spacing.sm, // Espacio entre label y textarea
    // preferenceItem ya tiene marginBottom, así que no es necesario aquí
  },
  textArea: {
    width: '100%', // Ocupa todo el ancho disponible en su contenedor
    height: 100, // Altura fija para el área de texto
    backgroundColor: colors.white,
    borderRadius: radius.sm,
    padding: spacing.md, // Padding interno
    fontSize: typography.body2,
    color: colors.black,
    ...shadow.md,
    borderWidth: 0.5,
    borderColor: 'rgba(200, 200, 200, 0.5)',
    textAlignVertical: 'top', // El texto comienza desde la parte superior
  },
  comidasContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.md, // Margen superior para separar de las preferencias
  },
  comidasButton: {
    flex: 1, // Distribuye el espacio equitativamente entre los botones
    alignItems: 'center',
    padding: spacing.sm,
    borderRadius: radius.lg, // Bordes más redondeados para botones
    backgroundColor: colors.lightGray, // Color base
  },
  comidasButtonActive: {
    backgroundColor: colors.primary, // Color cuando está activo
    // El color del texto se manejará en el componente para cambiar entre light/dark
  },
  generarContainer: {
    // Este estilo podría ser más global si se usa en otras partes para botones de acción principales
    marginHorizontal: spacing.xl, // Consistente con preferencesCard
    marginTop: spacing.lg, // Espacio antes del botón
  },
  generarButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.primary,
    padding: spacing.lg, // Padding generoso para un botón de acción principal
    borderRadius: radius.md,
    // ...shadow.md, // Opcional: añadir sombra si se desea destacar más
  },
});