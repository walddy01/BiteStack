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
    marginBottom: spacing.lg,
    color: colors.primary,
    fontSize: typography.h1,
    fontWeight: 'bold',
  },
  stepTitle: {
    fontSize: typography.body1,
    fontWeight: 'bold',
    color: colors.black,
    marginBottom: spacing.lg,
    textAlign: 'center',
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
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: spacing.md,
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.md,
    alignItems: "center",
    flex: 1,
    marginHorizontal: spacing.xs,
  },
  buttonText: {
    color: colors.white,
    fontSize: typography.body1,
    fontWeight: "bold",
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  outlineButtonText: {
    color: colors.primary,
  },
  loginLink: {
    marginTop: spacing.lg,
  },
  loginLinkText: {
    color: colors.primary,
    fontSize: typography.body2,
    textAlign: 'center',
  },
  activityIndicator: {
    marginVertical: spacing.lg,
  },
  errorText: {
    color: colors.red,
    fontSize: typography.body2,
    textAlign: 'center',
    marginBottom: spacing.md,
  }
});
