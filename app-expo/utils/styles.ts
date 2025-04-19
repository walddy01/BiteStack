import { StyleSheet } from "react-native";
import { colors } from "./colors";

export const styles = StyleSheet.create({
  container: {
      flex: 1,
      backgroundColor: colors.white,
    },
    header: {
      padding: 20,
    },
    title: {
      color: colors.black,
      fontSize: 24,
      fontWeight: 'bold',
    },
    subtitle: {
      color: colors.gray,
      fontSize: 18,
    },
    text: {
      fontSize: 16,
    },
    dark: {
      color: colors.black,
    },
    light: {
      color: colors.white,
    },
    bold: {
      fontWeight: 'bold',
    },
    preferencesCard: {
      margin: 20,
      padding: 20,
      borderRadius: 10,
      backgroundColor: colors.lighterGray,
      shadowColor: 'rgba(0, 0, 0, 0.1)',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 12,
      elevation: 3,
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
      gap: 6,
      backgroundColor: colors.primary,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 20,
      minHeight: 33,
  
    },
    cancelButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.lightRed,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 20,
      minHeight: 33,
    },
    saveButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.green,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 20,
      minHeight: 33,
    },
    generarContainer: {
      marginHorizontal: 20,
    },
    generarButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 10,
      backgroundColor: colors.primary,
      padding: 15,
      borderRadius: 10,
    },
    comidasButton: {
      flex: 1,
      alignItems: 'center',
      padding: 10,
      borderRadius: 20,
      backgroundColor: colors.lightGray,
    },
    comidasButtonActive: {
      backgroundColor: colors.primary,
    },
    comidasContainer: {
      flexDirection: 'row',
      gap: 10,
    },
    preferencesDetails: {
      marginTop: 15,
      marginBottom: 10, //Espacio antes de los botones
    },
    preferenceItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 8, // Espacio entre cada item
    },
    preferenceLabel: {
      color: colors.gray, // Color gris para las etiquetas
      marginRight: 10,  // Añadido margen
    },
    preferenceValue: {
      color: colors.black, // Color para los valores
      fontWeight: '500',
      flexShrink: 1,      // Para que se ajuste si el texto es largo
      textAlign: 'right', // Alinea a la derecha
    },
    preferenceInput: {
      flex: 1,
      height: 36,
      maxWidth: '60%',
      backgroundColor: colors.white,
      borderRadius: 8,
      paddingHorizontal: 10,
      shadowColor: 'rgba(0, 0, 0, 0.1)',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 12,
      elevation: 3,
      borderWidth: 0.5,
      borderColor: 'rgba(200, 200, 200, 0.5)',
    },
    textAreaContainer: {
      flexDirection: 'column',
      alignItems: 'flex-start',
      gap: 8,
    },
    textArea: {
      width: '100%',
      height: 100,
      backgroundColor: '#ffffff',
      borderRadius: 8,
      padding: 12,
      fontSize: 14,
      color: '#111827',
      shadowColor: 'rgba(0, 0, 0, 0.1)',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 12,
      elevation: 3,
      borderWidth: 0.5,
      borderColor: 'rgba(200, 200, 200, 0.5)',
    },
})