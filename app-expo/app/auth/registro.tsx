// src/screens/RegistroScreen.tsx
import { useAuth } from "@/hooks/useAuth";
import { router } from "expo-router";
import React, { useState } from "react";
import { ActivityIndicator, Button, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

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

  const onChange = (key: string, val: string) =>
    setForm(f => ({ ...f, [key]: val }));

  const validarFormulario = () => {
    if (!form.email || !form.password || !form.nombre || !form.apellidos) {
      setError("Los campos nombre, apellidos, email y contraseña son obligatorios");
      return false;
    }
    if (form.password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres");
      return false;
    }
    if (!form.email.includes("@")) {
      setError("El email no es válido");
      return false;
    }
    return true;
  };

  const onSubmit = async () => {
    try {
      setError(null);
      if (!validarFormulario()) return;
      
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
        return;
      }

      router.replace("/auth/login");
    } catch (_err) {
      setError("Error al registrar usuario. Por favor, intente nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Registro</Text>
      {error && <Text style={styles.error}>{error}</Text>}
      
      <View style={styles.inputContainer}>
        <TextInput 
          style={styles.input} 
          placeholder="Nombre *" 
          placeholderTextColor="#666"
          onChangeText={v => onChange("nombre", v)} 
        />
        <TextInput 
          style={styles.input} 
          placeholder="Apellidos *" 
          placeholderTextColor="#666"
          onChangeText={v => onChange("apellidos", v)} 
        />
        <TextInput 
          style={styles.input} 
          placeholder="Email *" 
          placeholderTextColor="#666"
          autoCapitalize="none" 
          keyboardType="email-address" 
          onChangeText={v => onChange("email", v)} 
        />
        <TextInput 
          style={styles.input} 
          placeholder="Contraseña * (mínimo 8 caracteres)" 
          placeholderTextColor="#666"
          secureTextEntry 
          onChangeText={v => onChange("password", v)} 
        />
        <TextInput 
          style={styles.input} 
          placeholder="Dieta (opcional)" 
          placeholderTextColor="#666"
          onChangeText={v => onChange("dieta", v)} 
        />
        <TextInput 
          style={styles.input} 
          placeholder="Porciones (opcional)" 
          placeholderTextColor="#666"
          keyboardType="numeric" 
          onChangeText={v => onChange("porciones", v)} 
        />
        <TextInput 
          style={styles.input} 
          placeholder="Preferencias adicionales (opcional)" 
          placeholderTextColor="#666"
          onChangeText={v => onChange("preferencias", v)} 
        />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <View style={styles.buttonContainer}>
          <Button title="Registrar" onPress={onSubmit} />
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#25292e',
    minHeight: '100%'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#fff'
  },
  inputContainer: {
    gap: 10,
    marginBottom: 20
  },
  input: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    fontSize: 16
  },
  error: {
    color: '#ff4444',
    textAlign: 'center',
    marginBottom: 10
  },
  buttonContainer: {
    marginTop: 10
  }
});
