import { StyleSheet } from 'react-native';
import { colors } from '../colors';

export const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  authErrorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  authErrorTitle: {
    color: colors.red,
    marginBottom: 10,
  },
  authErrorText: {
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});
