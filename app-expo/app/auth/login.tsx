// src/screens/LoginScreen.tsx
import { useAuth } from "@/hooks/useAuth";
import { router } from "expo-router";
import React, { useState } from "react";
import { ActivityIndicator, Button, StyleSheet, Text, TextInput, View } from "react-native";

export default function LoginScreen() {
  const { signIn, cargando, error: authError } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const onLogin = async () => {
    setError(null);
    const data = await signIn(email.trim(), password);
    if (!data) {
      setError(authError);
    } else {
      router.replace("/(tabs)");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Iniciar Sesión</Text>
      {error && <Text style={styles.error}>{error}</Text>}
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#666"
        autoCapitalize="none"
        keyboardType="email-address"
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        placeholderTextColor="#666"
        secureTextEntry
        onChangeText={setPassword}
      />
      {cargando ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <Button title="Ingresar" onPress={onLogin} />
      )}
      <Button
        title="¿No tienes cuenta? Regístrate"
        onPress={() => router.push("/auth/registro")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#25292e",
    flex: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#fff",
  },
  input: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 5,
    fontSize: 16,
    marginBottom: 10,
  },
  error: {
    color: "#ff4444",
    textAlign: "center",
    marginBottom: 10,
  },
});
