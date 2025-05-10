// src/screens/LoginScreen.tsx
import { useAuth } from "@/hooks/useAuth";
import { colors } from "@/styles/colors";
import { styles as globalStyles, radius, spacing, typography } from "@/styles/styles";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Image, KeyboardAvoidingView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function LoginScreen() {
  const { signIn, cargando, error: authError, session } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Redirige si ya hay sesión
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

const styles = StyleSheet.create({
  keyboardAvoidingContainer: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    ...globalStyles.container,
    justifyContent: "center",
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xxl,
    backgroundColor: colors.white,
    alignItems: 'center',
    marginTop: 'auto',
  },
  logo: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
    marginBottom: spacing.xl,
    borderRadius: radius.lg,
  },
  title: {
    ...globalStyles.title,
    textAlign: "center",
    marginBottom: spacing.xl,
    color: colors.primary,
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
  button: {
    backgroundColor: colors.primary,
    padding: spacing.lg,
    borderRadius: radius.md,
    alignItems: "center",
    marginBottom: spacing.md,
    width: '100%',
  },
  buttonText: {
    color: colors.white,
    fontSize: typography.body1,
    fontWeight: "bold",
  },
  secondaryButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: colors.primary,
    marginTop: spacing.sm,
  },
  secondaryButtonText: {
    color: colors.primary,
  },
  errorText: {
    color: colors.red,
    textAlign: "center",
    marginBottom: spacing.md,
    fontSize: typography.body2,
    width: '100%',
  },
  activityIndicator: {
    marginTop: spacing.lg,
    marginBottom: spacing.lg,
  }
});
