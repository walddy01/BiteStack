import { StyleSheet } from "react-native";
import { colors } from "../colors";
import { radius, shadow, spacing, typography } from "../globalStyles";

export const styles = StyleSheet.create({
  preferencesCard: {
    margin: spacing.xl,
    padding: spacing.xl, // Utiliza spacing.xl
    borderRadius: radius.lg, // Utiliza radius.lg
    backgroundColor: colors.white,
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
    // marginBottom: spacing.sm,
  },
  preferenceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
    alignItems: 'center', 
  },
  preferenceLabel: {
    marginRight: spacing.sm,
  },
  preferenceValue: {
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
    fontSize: typography.body2,
    color: colors.black,
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
    fontSize: typography.body2,
    color: colors.black,
    ...shadow.md,
    borderWidth: 0.5,
    borderColor: 'rgba(200, 200, 200, 0.5)',
    textAlignVertical: 'top',
  },
  comidasContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.md,
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
  generarContainer: {
    marginHorizontal: spacing.xl,
    // marginTop: spacing.lg, // Cambiado para que coincida con SliderRecetas
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
});