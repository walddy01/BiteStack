import { StyleSheet } from 'react-native';
import { colors } from '../colors';
import { radius, spacing, typography, shadow } from '../globalStyles';

export const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: colors.lighterGray,
    paddingHorizontal: 20,
  },
  scrollContentContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  headerContainer: {
    paddingTop: 50,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.black,
    marginBottom: 20,
    textAlign: "center",
  },
  listContainer: {
    paddingBottom: 10,
  },
  cardContainer: {
    flexDirection: "row",
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    marginBottom: spacing.xl,
    overflow: "hidden",
    borderWidth: 0.5,
    borderColor: "rgba(200, 200, 200, 0.5)",
    ...shadow.sm,
  },
  cardLeftSide: {
    width: 70,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.white,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.lighterGray,
    justifyContent: "center",
    alignItems: "center",
  },
  cardRightSide: {
    flex: 1,
    padding: 15,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.black,
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  dateText: {
    color: colors.primary,
    fontWeight: "600",
    fontSize: 15,
    marginLeft: 8,
  },
  ingredientsPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.lighterGray,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: "flex-start",
  },
  ingredientsText: {
    fontSize: 14,
    color: colors.gray,
    fontWeight: "500",
  },
  contentAreaContainer: {
    flex: 1,
  },
  compactLoadingContainer: {
    paddingVertical: 30,
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  centeredMessageContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.lg,
    minHeight: 250,
  },
  messageTitle: {
    fontSize: typography.h2,
    fontWeight: "bold",
    textAlign: "center",
    color: colors.black,
  },
  messageText: {
    fontSize: typography.body1,
    color: colors.gray,
    textAlign: "center",
    marginTop: spacing.sm,
    lineHeight: typography.body1 * 1.5,
  },
  emptyListTitle: {
    fontSize: typography.h2,
    fontWeight: "600",
    color: colors.black,
    marginTop: spacing.lg,
    textAlign: "center",
  },
  emptyListSubtitle: {
    fontSize: typography.body1,
    color: colors.gray,
    textAlign: "center",
    marginTop: spacing.sm,
    paddingHorizontal: spacing.lg,
    lineHeight: typography.body1 * 1.5,
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md + 2,
    paddingHorizontal: spacing.xl + 5,
    borderRadius: radius.md,
    alignItems: "center",
    minWidth: 180,
    ...shadow.sm,
  },
  buttonText: {
    color: colors.white,
    fontSize: typography.body1,
    fontWeight: "bold",
  },
});
