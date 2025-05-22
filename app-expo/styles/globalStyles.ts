import { StyleSheet } from "react-native";
import { colors } from "./colors";

const typography = {
  h1: 28,
  h2: 20,
  body1: 16,
  body2: 14,
  caption: 12,
};

const spacing = {
  xs: 4,
  sm: 10,
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

export { radius, shadow, spacing, typography };

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.lighterGray,
  },
  header: {
    paddingTop: spacing.xxxl,
    paddingHorizontal: spacing.xl,
  },
  title: {
    color: colors.black,
    fontSize: typography.h1,
    fontWeight: 'bold',
  },
  subtitle: {
    color: colors.gray,
    fontSize: typography.h2,
  },
  text: {
    fontSize: typography.body1,
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
  errorText: {
    color: colors.red,
    textAlign: "center",
    marginBottom: spacing.md,
    fontSize: typography.body2,
    width: '100%',
  },
});