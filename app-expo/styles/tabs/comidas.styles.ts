import { StyleSheet } from 'react-native';
import { colors } from '../colors';
import { radius, spacing } from '../globalStyles';

export const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: colors.lighterGray,
    paddingHorizontal: 20,
  },
  headerContainer: {
    paddingTop: 50,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.black,
    marginBottom: 20,
    textAlign: 'center',
  },
  toggleButtons: {
    flexDirection: 'row',
    marginBottom: 25,
    gap: 0,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeButton: {
    backgroundColor: colors.primary,
  },
  inactiveButton: {
    backgroundColor: colors.lightGray,
  },
  toggleButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  activeButtonText: {
    color: colors.white,
  },
  inactiveButtonText: {
    color: colors.gray,
  },
  menuWeekContainer: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: spacing.xl,
    marginBottom: 20,
    borderWidth: 0.5,
    borderColor: 'rgba(200, 200, 200, 0.5)',
  },
  menuWeekHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  menuWeekTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.black,
    marginLeft: 10,
  },
  menuItemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  menuItemName: {
    fontSize: 16,
    color: colors.black,
  },
  menuItemTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemTime: {
    fontSize: 14,
    color: colors.gray,
    marginLeft: 6,
  },
  verMasBoton: { 
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20, 
    marginTop: 10, 
  },
  verMasBotonText: { 
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 15,
    marginLeft: 8, 
  },
  recipesTabContainer: {},
  recipeCard: {
    backgroundColor: colors.white,
    borderRadius: radius.lg, 
    padding: spacing.xl, 
    marginBottom: spacing.xl, 
    borderWidth: 0.5,
    borderColor: 'rgba(200, 200, 200, 0.5)',
  },
  recipeCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 10,
  },
  recipeTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 10,
  },
  recipeTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '700',
    color: colors.black,
  },
  recipeDescription: {
    fontSize: 15,
    color: colors.gray,
    lineHeight: 15 * 1.4,
    marginBottom: 10,
  },
  recipeInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: colors.lightGray,
    paddingTop: 10,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  infoText: {
    fontSize: 13,
    color: colors.gray,
    fontWeight: '500',
  },
  placeholderText: {
    fontSize: 16,
    color: colors.gray,
    textAlign: 'center',
    marginTop: 30,
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxl,
    paddingHorizontal: spacing.lg,
  },
  emptyStateTitle: {
    fontSize: 20, // typography.h3, pero como no existe usamos un valor directo
    fontWeight: 'bold',
    color: colors.black,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  emptyStateSubtitle: {
    fontSize: 16, // typography.body1
    color: colors.gray,
    textAlign: 'center',
    paddingHorizontal: spacing.md,
  },
});
