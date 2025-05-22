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
    justifyContent: 'center',
  },
  container: {
    justifyContent: "center",
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xxl,
    backgroundColor: colors.white,
    alignItems: 'center',
  },
  logo: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
    marginBottom: spacing.xl,
    borderRadius: radius.lg,
  },
  title: {
    textAlign: "center",
    marginBottom: spacing.xl,
    color: colors.primary,
    fontSize: typography.h1,
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
    marginTop: spacing.sm,
  },
  secondaryButtonText: {
    color: colors.primary,
  },
  activityIndicator: {
    marginVertical: spacing.lg,
  }
});
