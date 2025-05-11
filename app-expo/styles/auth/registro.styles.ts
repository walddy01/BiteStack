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
    // Consider removing flex: 1 from globalStyles.container if it exists,
    // or manage layout specifically here if needed.
    // flex: 1, // Uncomment if full height within ScrollView is desired
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
    // fontSize and fontWeight can be inherited from globalStyles.title if used globally
    // Otherwise, define explicitly: fontSize: typography.h1, fontWeight: 'bold',
    textAlign: "center",
    marginBottom: spacing.lg,
    color: colors.primary,
    fontSize: typography.h1, // Ensure desired size
    fontWeight: 'bold',
  },
  stepTitle: {
    fontSize: typography.body1,
    fontWeight: 'bold',
    color: colors.black, // Or another color from your palette
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
    height: 100, // Adjust height as needed for multiline input
    textAlignVertical: 'top', // Align text to the top for multiline
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between', // Or 'space-around' based on desired spacing
    width: '100%',
    marginTop: spacing.md,
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg, // Ensure consistent padding
    borderRadius: radius.md,
    alignItems: "center",
    // marginBottom: spacing.md, // Removed as buttons are now in a container
    flex: 1, // Distribute space if multiple buttons in a row
    marginHorizontal: spacing.xs, // Add small horizontal margin between buttons
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
    marginTop: spacing.lg, // Increased spacing from buttons
  },
  loginLinkText: {
    color: colors.primary,
    fontSize: typography.body2,
    textAlign: 'center',
  },
  errorText: {
    color: colors.red,
    textAlign: "center",
    marginBottom: spacing.md,
    fontSize: typography.body2,
    width: '100%',
  },
  activityIndicator: {
    marginVertical: spacing.lg, // Consistent vertical spacing
  }
});
