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
    backgroundColor: colors.lighterGray, 
    paddingBottom: spacing.sm 
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: spacing.lg,
    marginBottom: spacing.xs,
    marginLeft: spacing.xl,
    color: colors.black,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.sm,
  },
  dayText: {
    flex: 1,
    textAlign: 'center',
    fontSize: typography.h2,
    fontWeight: 'bold',
    color: colors.black,
  },
  dayContainer: { 
    width: windowWidth, 
    paddingHorizontal: spacing.xl 
  },
  recipesContainer: { 
    paddingVertical: spacing.sm 
  },
  recipeCard: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: spacing.xl,
    ...shadow.md,
    borderWidth: 0.5,
    borderColor: 'rgba(200, 200, 200, 0.5)',
  },
  recipeCardMargin: {
    marginBottom: spacing.xl,
  },
  recipeHeader: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: spacing.md, 
    gap: spacing.md 
  },
  recipeTitle: { 
    flex: 1, 
    fontSize: 18,
    fontWeight: '700',
    color: colors.black 
  },
  recipeDescription: {
    fontSize: 15,
    color: colors.gray,
    lineHeight: 15 * 1.4,
    marginBottom: spacing.md,
  },
  recipeInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: colors.lightGray,
    paddingTop: spacing.lg,
  },
  infoItem: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: spacing.sm 
  },
  infoText: { 
    fontSize: typography.body2,
    color: colors.gray, 
    fontWeight: '500' 
  },
  centered: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    padding: spacing.xl 
  },
  loadingText: { 
    marginTop: spacing.sm,
    fontSize: typography.body1,
    color: colors.gray 
  },
  errorText: { 
    fontSize: 18,
    fontWeight: 'bold', 
    color: colors.red,
    textAlign: 'center', 
    marginBottom: spacing.xs 
  },
  errorTextDetail: { 
    fontSize: typography.body2,
    color: colors.gray, 
    textAlign: 'center' 
  },
  noDataText: { 
    fontSize: typography.body1,
    color: colors.gray 
  },
  navButton: {
    padding: spacing.xs,
  }
});
