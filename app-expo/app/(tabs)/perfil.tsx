import { colors } from "@/styles/colors";
import { radius, spacing, typography } from "@/styles/styles";
import { useRouter } from "expo-router";
import { ChevronRight, Edit3, HelpCircle, Info, LogOut, ShieldCheck, UserCircle2 } from 'lucide-react-native';
import React, { useState } from 'react'; // React es necesario para JSX
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from "../../hooks/useAuth";
import AlertPersonalizado from '@/components/AlertPersonalizado'; // Asegúrate que este componente también maneje sus textos correctamente

export default function Perfil() {
  const { session, signOut } = useAuth();
  const router = useRouter();

  // Estados para el AlertPersonalizado
  const [alertaVisible, setAlertaVisible] = useState(false);
  const [alertaMensaje, setAlertaMensaje] = useState('');
  const [alertaTipo, setAlertaTipo] = useState<'exito' | 'error' | 'info'>('info');

  // Función helper para mostrar la alerta
  const mostrarAlerta = (mensaje: string, tipo: 'exito' | 'error' | 'info' = 'info') => {
    setAlertaMensaje(mensaje);
    setAlertaTipo(tipo);
    setAlertaVisible(true);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      mostrarAlerta('Has cerrado sesión correctamente', 'exito');
      // Es común querer que el usuario vea la alerta antes de redirigir,
      // pero para una redirección inmediata después del signOut, esto está bien.
      // Si quieres que vea la alerta, podrías poner un pequeño delay o
      // redirigir en el onClose de la alerta.
      router.replace('/auth/login');
    } catch (e: any) {
      mostrarAlerta(e.message || 'No se pudo cerrar sesión', 'error');
    }
  };

  // Construcción del nombre completo del usuario, asegurando que siempre sea un string.
  const userName = session?.user?.user_metadata?.nombre;
  const userLastName = session?.user?.user_metadata?.apellidos;
  const userFullName = userName && userLastName ? `${userName} ${userLastName}` : userName || "Usuario";

  // Definición de las opciones del menú.
  // Las funciones onPress ahora usan `mostrarAlerta`.
  const menuOptions = [
    { title: "Editar Perfil", icon: <Edit3 size={24} color={colors.primary} />, onPress: () => mostrarAlerta("Próximamente...", 'info') },
    { title: "Seguridad", icon: <ShieldCheck size={24} color={colors.primary} />, onPress: () => mostrarAlerta("Próximamente...", 'info') },
    { title: "Ayuda y Soporte", icon: <HelpCircle size={24} color={colors.primary} />, onPress: () => mostrarAlerta("Próximamente...", 'info') },
    { title: "Acerca de", icon: <Info size={24} color={colors.primary} />, onPress: () => mostrarAlerta("BiteStack v1.0", 'info') },
  ];

  return (
    <>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          {session ? (
            // --- VISTA PARA USUARIO CON SESIÓN ACTIVA ---
            <View style={styles.container}>
              <View style={styles.profileHeader}>
                {/* UserCircle2 es un componente (ícono), no necesita <Text> */}
                <UserCircle2 size={80} color={colors.primary} strokeWidth={1.5} />
                {/* userFullName es un string, debe estar en <Text> */}
                <Text style={styles.userName}>{userFullName}</Text>
                {/* session.user.email es un string, debe estar en <Text>. Verificamos que exista. */}
                {session.user?.email && <Text style={styles.emailText}>{session.user.email}</Text>}
              </View>

              <View style={styles.menuContainer}>
                {menuOptions.map((option, index) => (
                  <TouchableOpacity key={index} style={styles.optionButton} onPress={option.onPress}>
                    {/* option.icon es un componente (ícono), no necesita <Text> */}
                    {option.icon}
                    {/* option.title es un string, debe estar en <Text> */}
                    <Text style={styles.optionText}>{option.title}</Text>
                    {/* ChevronRight es un componente (ícono), no necesita <Text> */}
                    <ChevronRight size={20} color={colors.gray} />
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity
                style={styles.logoutButton}
                onPress={handleSignOut}
              >
                {/* LogOut es un componente (ícono), no necesita <Text> */}
                <LogOut size={20} color={colors.white} style={{ marginRight: spacing.sm }} />
                {/* "Cerrar Sesión" es un string literal, debe estar en <Text> */}
                <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
              </TouchableOpacity>
            </View>
          ) : (
            // --- VISTA PARA USUARIO SIN SESIÓN (INVITADO) ---
            <View style={styles.authContainer}>
              {/* UserCircle2 es un componente (ícono), no necesita <Text> */}
              <UserCircle2 size={80} color={colors.gray} strokeWidth={1.5} />
              {/* El texto informativo es un string literal, debe estar en <Text> */}
              <Text style={styles.infoText}>
                Necesitas iniciar sesión para ver tu perfil y acceder a todas las funcionalidades.
              </Text>
              <TouchableOpacity style={styles.button} onPress={() => router.push("/auth/login")}>
                {/* El texto del botón es un string literal, debe estar en <Text> */}
                <Text style={styles.buttonText}>Ir a Iniciar Sesión</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.button, styles.secondaryButton]} onPress={() => router.push("/auth/registro")}>
                {/* El texto del botón es un string literal, debe estar en <Text> */}
                <Text style={[styles.buttonText, styles.secondaryButtonText]}>Crear Cuenta</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>

      {/* El componente AlertPersonalizado se renderiza aquí.
          Asegúrate de que AlertPersonalizado también envuelva todos sus strings internos en <Text>.
          La prop `mensaje` aquí es `alertaMensaje`, que es un string. */}
      <AlertPersonalizado
        visible={alertaVisible}
        mensaje={alertaMensaje}
        tipo={alertaTipo}
        onClose={() => setAlertaVisible(false)}
      />
    </>
  );
}

// Los estilos se mantienen iguales, ya que la solicitud era mantener la apariencia.
// Estos estilos ya estaban bien definidos.
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },
  container: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xl,
    backgroundColor: colors.white,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: spacing.xxl,
    marginTop: spacing.xxl,
  },
  userName: {
    fontSize: typography.h2,
    fontWeight: 'bold',
    color: colors.black,
    marginTop: spacing.md,
  },
  emailText: {
    fontSize: typography.body1,
    color: colors.gray,
    marginTop: spacing.xs,
  },
  menuContainer: {
    width: '100%',
    marginBottom: spacing.xl,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.lightGray,
    width: '100%',
  },
  optionText: {
    flex: 1,
    fontSize: typography.body1,
    color: colors.black,
    marginLeft: spacing.md,
  },
  logoutButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: "center",
    backgroundColor: colors.primary,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
    borderRadius: radius.md,
    width: '100%',
    marginTop: 'auto', // Esto ayuda a empujar el botón hacia abajo si hay espacio vertical
    marginBottom: spacing.md,
  },
  logoutButtonText: {
    color: colors.white,
    fontSize: typography.body1,
    fontWeight: "bold",
  },
  authContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    backgroundColor: colors.white,
  },
  infoText: {
    fontSize: typography.body1,
    color: colors.gray,
    textAlign: 'center',
    marginBottom: spacing.xl,
    marginTop: spacing.md,
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
  },
  secondaryButtonText: {
    color: colors.primary,
  },
  scrollViewContent: {
    flexGrow: 1, // Esencial para que el contenido del ScrollView pueda expandirse y centrarse si es corto.
    // paddingBottom: spacing.xl, // Puedes añadir padding inferior si es necesario.
    backgroundColor: colors.white,
  },
});