import { StyleSheet } from "react-native";
import { colors } from "@/styles/colors";
import { spacing, typography } from "@/styles/globalStyles";

export const errorStyles = StyleSheet.create({
  errorText: {
    color: colors.red,
    textAlign: "center",
    marginBottom: spacing.md,
    fontSize: typography.body2,
    width: '100%',
  },
});
