import { useAuth } from "@/hooks/useAuth";
import { StyleSheet, Text, View } from "react-native";
import { colors } from "../../styles/colors";
import { styles as globalStyles } from '../../styles/globalStyles';

export default function Lista() {
  const { session } = useAuth();

  if (!session) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.white }}>
        <Text style={[globalStyles.text, globalStyles.bold, { color: colors.red, marginBottom: 10 }]}>Error de Autenticación</Text>
        <Text style={[globalStyles.text, { textAlign: 'center', paddingHorizontal: 20 }]}>No estás autenticado. Por favor, inicia sesión para continuar.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Pendiente de implementar pantalla lista de la compra.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.lightGray,
  },
  text: {
    color: colors.black,
  }
});