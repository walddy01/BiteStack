import { StyleSheet, Text, View } from "react-native";

export default function Comidas() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Edit app/comidas.tsx to edit this screen.</Text>
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
    color: '#fff'
  }
});