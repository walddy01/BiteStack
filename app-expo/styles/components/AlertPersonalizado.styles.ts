import { StyleSheet } from "react-native";
import { colors } from "../colors";
import { radius, shadow, spacing, typography } from "../globalStyles";

export const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    marginHorizontal: spacing.xl,
    width: '80%',
    minHeight: 150,
    backgroundColor: colors.white,
    borderRadius: radius.md,
    padding: spacing.xl,
    alignItems: 'center',
    ...shadow.md,
    borderWidth: 2,
  },
  modalText: {
    marginBottom: spacing.lg,
    textAlign: 'center',
    color: colors.black,
    fontSize: typography.body1,
  },
  button: {
    borderRadius: radius.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    minWidth: 100,
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  buttonText: {
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: typography.body2,
  },
});
