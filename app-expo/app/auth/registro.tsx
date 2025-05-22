import { useAuth } from "@/hooks/useAuth";
import { colors } from "@/styles/colors";
import { router } from "expo-router";
import React, { useState } from "react";
import { ActivityIndicator, Image, KeyboardAvoidingView, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { styles } from "@/styles/auth/registro.styles";
import AlertPersonalizado from "@/components/AlertPersonalizado"; // Importar AlertPersonalizado

export default function RegistroScreen() {
  const { signUpApi } = useAuth();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    nombre: "",
    apellidos: "",
    email: "",
    password: "",
    dieta: "", // Valor por defecto
    porciones: "1", // Valor por defecto
    preferencias: "",
    alergias: "",
    calorias: "2000", // Valor por defecto
  });
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState(1);
  const [alertVisible, setAlertVisible] = useState(false); // Estado para la visibilidad de la alerta
  const [alertMessage, setAlertMessage] = useState(""); // Estado para el mensaje de la alerta
  const [alertType, setAlertType] = useState<"exito" | "error" | "info">("info"); // Estado para el tipo de alerta


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
      setError(null);
    }
  };

  const onSubmit = async () => {
    try {
      setError(null);
      setLoading(true);
      const response = await signUpApi({
        email: form.email.trim(),
        password: form.password,
        nombre: form.nombre.trim(),
        apellidos: form.apellidos.trim(),
        dieta: form.dieta.trim() || undefined,
        porciones: form.porciones.trim() === "" ? undefined : Number(form.porciones.trim()),
        preferencias_adicionales: form.preferencias.trim() || undefined,
        alergias: form.alergias.trim() || undefined,
        calorias: form.calorias.trim() === "" ? undefined : Number(form.calorias.trim()),
      });
      if (response.error) {
        setError(response.error);
        setLoading(false);
        return;
      }
      setLoading(false);
      setAlertMessage("Por favor, verifica tu correo electrónico para activar tu cuenta.");
      setAlertType("info");
      setAlertVisible(true);
    } catch {
      setError("Error al registrar usuario. Por favor, intente nuevamente.");
      setLoading(false);
    }
  };

  const handleAlertClose = () => {
    setAlertVisible(false);
    router.replace("/auth/login");
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
              style={styles.input}
              placeholder="Alergias (ej: Frutos secos, Gluten)"
              placeholderTextColor={colors.gray}
              onChangeText={v => onChange("alergias", v)}
              value={form.alergias}
            />
            <TextInput
              style={styles.input}
              placeholder="Calorías diarias (ej: 2000)"
              placeholderTextColor={colors.gray}
              keyboardType="numeric"
              onChangeText={v => onChange("calorias", v)}
              value={form.calorias}
            />
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Preferencias adicionales"
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
      behavior="padding"
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
          <TouchableOpacity style={styles.loginLink} onPress={() => router.replace('/auth/login')}>
            <Text style={styles.loginLinkText}>¿Ya tienes cuenta? Inicia sesión</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <AlertPersonalizado
        visible={alertVisible}
        mensaje={alertMessage}
        tipo={alertType}
        onClose={handleAlertClose}
      />
    </KeyboardAvoidingView>
  );
}
