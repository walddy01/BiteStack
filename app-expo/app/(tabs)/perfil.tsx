import { colors } from "@/styles/colors";
import { spacing } from "@/styles/globalStyles";
import { useRouter } from "expo-router";
import { ChevronRight, Edit3, Info, LogOut, ShieldCheck, UserCircle2 } from 'lucide-react-native';
import React, { useState } from 'react';
import { SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from "../../hooks/useAuth";
import AlertPersonalizado from '@/components/AlertPersonalizado';
import { styles } from '../../styles/tabs/perfil.styles';

export default function Perfil() {
  const { session, signOut } = useAuth();
  const router = useRouter();

  const [alertaVisible, setAlertaVisible] = useState(false);
  const [alertaMensaje, setAlertaMensaje] = useState('');
  const [alertaTipo, setAlertaTipo] = useState<'exito' | 'error' | 'info'>('info');

  const mostrarAlerta = (mensaje: string, tipo: 'exito' | 'error' | 'info' = 'info') => {
    setAlertaMensaje(mensaje);
    setAlertaTipo(tipo);
    setAlertaVisible(true);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      mostrarAlerta('Has cerrado sesión correctamente', 'exito');
      router.replace('/auth/login');
    } catch (e: any) {
      mostrarAlerta(e.message || 'No se pudo cerrar sesión', 'error');
    }
  };

  const userName = session?.user?.user_metadata?.nombre;
  const userLastName = session?.user?.user_metadata?.apellidos;
  const userFullName = userName && userLastName ? `${userName} ${userLastName}` : userName || "Usuario";

  const menuOptions = [
    { title: "Editar Perfil", icon: <Edit3 size={24} color={colors.primary} />, onPress: () => mostrarAlerta("Próximamente...", 'info') },
    { title: "Seguridad", icon: <ShieldCheck size={24} color={colors.primary} />, onPress: () => mostrarAlerta("Próximamente...", 'info') },
    // { title: "Ayuda y Soporte", icon: <HelpCircle size={24} color={colors.primary} />, onPress: () => mostrarAlerta("Próximamente...", 'info') },
    { title: "Acerca de", icon: <Info size={24} color={colors.primary} />, onPress: () => mostrarAlerta("BiteStack v1.0", 'info') },
  ];

  return (
    <>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          {session ? (
            <View style={styles.container}>
              <View style={styles.profileHeader}>
                <UserCircle2 size={80} color={colors.primary} strokeWidth={1.5} />
                <Text style={styles.userName}>{userFullName}</Text>
                {session.user?.email && <Text style={styles.emailText}>{session.user.email}</Text>}
              </View>

              <View style={styles.menuContainer}>
                {menuOptions.map((option, index) => (
                  <TouchableOpacity key={index} style={styles.optionButton} onPress={option.onPress}>
                    {option.icon}
                    <Text style={styles.optionText}>{option.title}</Text>
                    <ChevronRight size={20} color={colors.gray} />
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity
                style={styles.logoutButton}
                onPress={handleSignOut}
              >
                <LogOut size={20} color={colors.white} style={{ marginRight: spacing.sm }} />
                <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.authContainer}>
              <UserCircle2 size={80} color={colors.gray} strokeWidth={1.5} />
              <Text style={styles.infoText}>
                Necesitas iniciar sesión para ver tu perfil y acceder a todas las funcionalidades.
              </Text>
              <TouchableOpacity style={styles.button} onPress={() => router.push("/auth/login")}>                
                <Text style={styles.buttonText}>Ir a Iniciar Sesión</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.button, styles.secondaryButton]} onPress={() => router.push("/auth/registro")}>                
                <Text style={[styles.buttonText, styles.secondaryButtonText]}>Crear Cuenta</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>

      <AlertPersonalizado
        visible={alertaVisible}
        mensaje={alertaMensaje}
        tipo={alertaTipo}
        onClose={() => setAlertaVisible(false)}
      />
    </>
  );
}