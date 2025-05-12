import { useAuth } from "@/hooks/useAuth";
import { colors } from "@/styles/colors";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Image, KeyboardAvoidingView, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { styles } from "@/styles/auth/login.styles";

export default function LoginScreen() {
  const { signIn, cargando, error: authError, session } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (session) {
      router.replace("/(tabs)");
    }
  }, [session]);

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
    <KeyboardAvoidingView
      behavior="padding"
      style={styles.keyboardAvoidingContainer}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <Image source={require('../../assets/icon.png')} style={styles.logo} />
          <Text style={styles.title}>Iniciar Sesión</Text>
          {error && <Text style={styles.errorText}>{error}</Text>}
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor={colors.gray}
            autoCapitalize="none"
            keyboardType="email-address"
            onChangeText={setEmail}
            value={email}
          />
          <TextInput
            style={styles.input}
            placeholder="Contraseña"
            placeholderTextColor={colors.gray}
            secureTextEntry
            onChangeText={setPassword}
            value={password}
          />
          {cargando ? (
            <ActivityIndicator size="large" color={colors.primary} style={styles.activityIndicator} />
          ) : (
            <TouchableOpacity style={styles.button} onPress={onLogin}>
              <Text style={styles.buttonText}>Ingresar</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity style={[styles.button, styles.secondaryButton]} onPress={() => router.push("/auth/registro")}>
            <Text style={[styles.buttonText, styles.secondaryButtonText]}>¿No tienes cuenta? Regístrate</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
