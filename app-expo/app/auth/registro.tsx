// src/screens/RegistroScreen.tsx
import { useAuth } from "@/hooks/useAuth";
import { colors } from "@/styles/colors";
import { styles as globalStyles, radius, spacing, TYPOGRAPHY } from "@/styles/styles";
import { router } from "expo-router";
import React, { useState } from "react";
import { ActivityIndicator, Image, KeyboardAvoidingView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function RegistroScreen() {
  const { signUpApi } = useAuth();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    nombre: "",
    apellidos: "",
    email: "",
    password: "",
    dieta: "",
    porciones: "",
    preferencias: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState(1); // Estado para el paso actual del onboarding

  const onChange = (key: string, val: string) =>
    setForm(f => ({ ...f, [key]: val }));

  const validarPaso1 = () => {
    if (!form.nombre || !form.apellidos) {
      setError("Nombre y apellidos son obligatorios.");
      return false;
    }
    setError(null);
    return true;
  };

  const validarPaso2 = () => {
    if (!form.email || !form.password) {
      setError("Email y contraseña son obligatorios.");
      return false;
    }
    if (form.password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      return false;
    }
    if (!form.email.includes("@")) {
      setError("El email no es válido.");
      return false;
    }
    setError(null);
    return true;
  };

  const nextStep = () => {
    if (step === 1 && validarPaso1()) {
      setStep(2);
    } else if (step === 2 && validarPaso2()) {
      setStep(3);
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
      setError(null); // Limpiar errores al retroceder
    }
  };

  const onSubmit = async () => {
    // La validación final se hace antes de llamar a onSubmit desde el último paso
    try {
      setError(null);
      setLoading(true);
      const response = await signUpApi({
        email: form.email.trim(),
        password: form.password,
        nombre: form.nombre.trim(),
        apellidos: form.apellidos.trim(),
        dieta: form.dieta.trim() || undefined,
        porciones: form.porciones ? Number(form.porciones) : undefined,
        preferencias_adicionales: form.preferencias.trim() || undefined,
      });

      if (response.error) {
        setError(response.error);
        setLoading(false);
        return;
      }
      setLoading(false);
      router.replace("/auth/login");
    } catch {
      setError("Error al registrar usuario. Por favor, intente nuevamente.");
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <>
            <Text style={styles.stepTitle}>Paso 1 de 3: Datos Personales</Text>
            <TextInput
              style={styles.input}
              placeholder="Nombre *"
              placeholderTextColor={colors.gray}
              onChangeText={v => onChange("nombre", v)}
              value={form.nombre}
            />
            <TextInput
              style={styles.input}
              placeholder="Apellidos *"
              placeholderTextColor={colors.gray}
              onChangeText={v => onChange("apellidos", v)}
              value={form.apellidos}
            />
          </>
        );
      case 2:
        return (
          <>
            <Text style={styles.stepTitle}>Paso 2 de 3: Credenciales</Text>
            <TextInput
              style={styles.input}
              placeholder="Email *"
              placeholderTextColor={colors.gray}
              autoCapitalize="none"
              keyboardType="email-address"
              onChangeText={v => onChange("email", v)}
              value={form.email}
            />
            <TextInput
              style={styles.input}
              placeholder="Contraseña * (mínimo 8 caracteres)"
              placeholderTextColor={colors.gray}
              secureTextEntry
              onChangeText={v => onChange("password", v)}
              value={form.password}
            />
          </>
        );
      case 3:
        return (
          <>
            <Text style={styles.stepTitle}>Paso 3 de 3: Preferencias (Opcional)</Text>
            <TextInput
              style={styles.input}
              placeholder="Dieta (ej: Vegetariana, Keto)"
              placeholderTextColor={colors.gray}
              onChangeText={v => onChange("dieta", v)}
              value={form.dieta}
            />
            <TextInput
              style={styles.input}
              placeholder="Porciones por comida (ej: 1)"
              placeholderTextColor={colors.gray}
              keyboardType="numeric"
              onChangeText={v => onChange("porciones", v)}
              value={form.porciones}
            />
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Preferencias adicionales o alergias"
              placeholderTextColor={colors.gray}
              onChangeText={v => onChange("preferencias", v)}
              value={form.preferencias}
              multiline
              numberOfLines={3}
            />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <KeyboardAvoidingView
      behavior="padding" // Modificado para usar padding en ambas plataformas
      style={styles.keyboardAvoidingContainer}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <Image source={require('../../assets/icon.png')} style={styles.logo} />
          <Text style={styles.title}>Crear Cuenta</Text>
          {error && <Text style={styles.errorText}>{error}</Text>}

          {renderStepContent()}

          {loading ? (
            <ActivityIndicator size="large" color={colors.primary} style={styles.activityIndicator} />
          ) : (
            <View style={styles.buttonContainer}>
              {step > 1 && (
                <TouchableOpacity style={[styles.button, styles.outlineButton]} onPress={prevStep}>
                  <Text style={[styles.buttonText, styles.outlineButtonText]}>Anterior</Text>
                </TouchableOpacity>
              )}
              {step < 3 ? (
                <TouchableOpacity style={styles.button} onPress={nextStep}>
                  <Text style={styles.buttonText}>Siguiente</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity style={styles.button} onPress={onSubmit}>
                  <Text style={styles.buttonText}>Registrar</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
          {!loading && (
            <TouchableOpacity style={styles.loginLink} onPress={() => router.push("/auth/login")}>
              <Text style={styles.loginLinkText}>¿Ya tienes cuenta? Inicia Sesión</Text>
            </TouchableOpacity>
          )}
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
    justifyContent: 'center',
  },
  container: {
    ...globalStyles.container,
    justifyContent: "center",
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xxl,
    backgroundColor: colors.white,
    alignItems: 'center',
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
    marginBottom: spacing.lg, 
    color: colors.primary,
  },
  stepTitle: {
    fontSize: TYPOGRAPHY.body1, // Corregido de TYPOGRAPHY.h6
    color: colors.gray, // Corregido de colors.darkGray
    marginBottom: spacing.lg,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: colors.lightGray,
    padding: spacing.lg,
    borderRadius: radius.md,
    fontSize: TYPOGRAPHY.body1,
    marginBottom: spacing.md, // Menos margen entre inputs en onboarding
    borderColor: 'rgba(200, 200, 200, 0.5)',
    borderWidth: 0.5,
    color: colors.black,
    width: '100%',
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: spacing.lg,
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    alignItems: "center",
    flex: 1, // Para que los botones se expandan si hay espacio
    marginHorizontal: spacing.xs, // Pequeño margen entre botones
  },
  outlineButton: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  buttonText: {
    color: colors.white,
    fontSize: TYPOGRAPHY.body1,
    fontWeight: "bold",
  },
  outlineButtonText: {
    color: colors.primary,
  },
  loginLink: {
    marginTop: spacing.xl,
  },
  loginLinkText: {
    color: colors.primary,
    fontSize: TYPOGRAPHY.body2,
    textAlign: 'center',
  },
  errorText: { 
    color: colors.red,
    textAlign: "center",
    marginBottom: spacing.md,
    fontSize: TYPOGRAPHY.body2,
    width: '100%',
  },
  activityIndicator: {
    marginTop: spacing.lg,
    marginBottom: spacing.lg,
  }
});
