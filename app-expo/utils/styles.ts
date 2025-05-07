import { StyleSheet } from "react-native";
import { colors } from "./colors";

// Constantes de diseño para mantener consistencia
const TYPOGRAPHY = {
  h1: 28,
  h2: 20,
  body1: 16,
  body2: 14,
  caption: 12,
};

const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 30,
  xxxl: 45,
};

const radius = {
  sm: 6,
  md: 12,
  lg: 20,
};

const shadow = {
  sm: {
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 2,
  },
  md: {
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 3,
  }
};

export { radius, shadow, spacing, TYPOGRAPHY };

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    paddingTop: spacing.xxxl,
    paddingHorizontal: spacing.xl,
  },
  title: {
    color: colors.black,
    fontSize: TYPOGRAPHY.h1,
    fontWeight: 'bold',
  },
  subtitle: {
    color: colors.gray,
    fontSize: TYPOGRAPHY.h2,
  },
  text: {
    fontSize: TYPOGRAPHY.body1,
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
  generarContainer: {
    marginHorizontal: spacing.xl,
  },
  generarButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.primary,
    padding: spacing.lg,
    borderRadius: radius.md,
  },
  comidasButton: {
    flex: 1,
    alignItems: 'center',
    padding: spacing.sm,
    borderRadius: radius.lg,
    backgroundColor: colors.lightGray,
  },
  comidasButtonActive: {
    backgroundColor: colors.primary,
  },
  comidasContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  preferencesDetails: {
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  preferenceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  preferenceLabel: {
    color: colors.gray,
    marginRight: spacing.sm,
  },
  preferenceValue: {
    color: colors.black,
    fontWeight: '500',
    flexShrink: 1,
    textAlign: 'right',
  },
  preferenceInput: {
    flex: 1,
    height: 36,
    maxWidth: '60%',
    backgroundColor: colors.white,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    ...shadow.md,
    borderWidth: 0.5,
    borderColor: 'rgba(200, 200, 200, 0.5)',
  },
  textAreaContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  textArea: {
    width: '100%',
    height: 100,
    backgroundColor: colors.white,
    borderRadius: radius.sm,
    padding: spacing.md,
    fontSize: TYPOGRAPHY.body2,
    color: colors.black,
    ...shadow.md,
    borderWidth: 0.5,
    borderColor: 'rgba(200, 200, 200, 0.5)',
  },
});