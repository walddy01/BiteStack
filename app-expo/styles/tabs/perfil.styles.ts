import { StyleSheet } from 'react-native';
import { colors } from '../colors';
import { radius, spacing, typography } from '../globalStyles';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },
  container: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xl,
    backgroundColor: colors.lighterGray,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: spacing.xxl,
    marginTop: spacing.xxl,
  },
  userName: {
    fontSize: typography.h2,
    fontWeight: 'bold',
    color: colors.black,
    marginTop: spacing.md,
  },
  emailText: {
    fontSize: typography.body1,
    color: colors.gray,
    marginTop: spacing.xs,
  },
  menuContainer: {
    width: '100%',
    marginBottom: spacing.xl,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.lightGray,
    width: '100%',
  },
  optionText: {
    flex: 1,
    fontSize: typography.body1,
    color: colors.black,
    marginLeft: spacing.md,
  },
  logoutButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: "center",
    backgroundColor: colors.primary,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
    borderRadius: radius.md,
    width: '100%',
    marginTop: 'auto',
    marginBottom: spacing.md,
  },
  logoutButtonText: {
    color: colors.white,
    fontSize: typography.body1,
    fontWeight: "bold",
  },
  authContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    backgroundColor: colors.white,
  },
  infoText: {
    fontSize: typography.body1,
    color: colors.gray,
    textAlign: 'center',
    marginBottom: spacing.xl,
    marginTop: spacing.md,
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
  },
  secondaryButtonText: {
    color: colors.primary,
  },
  scrollViewContent: {
    flexGrow: 1,
    backgroundColor: colors.white,
  },
});
