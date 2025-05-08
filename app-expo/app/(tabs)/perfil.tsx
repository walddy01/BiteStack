import { Link } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export default function Perfil() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Edit app/perfil.tsx to edit this screen.</Text>
      <Link href="/auth/login" style={styles.link}>
        <Text style={styles.linkText}>Ir a Login</Text>
      </Link>
      <Link href="/auth/registro" style={styles.link}>
        <Text style={styles.linkText}>Ir a Registro</Text>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: '#25292e',
  },
  text: {
    color: '#fff',
    marginBottom: 20
  },
  link: {
    marginVertical: 10,
    padding: 10,
    backgroundColor: '#4A5568',
    borderRadius: 5,
  },
  linkText: {
    color: '#fff',
    fontSize: 16
  }
});