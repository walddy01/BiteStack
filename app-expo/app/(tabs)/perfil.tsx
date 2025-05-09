import { colors } from "@/styles/colors";
import { radius, spacing, TYPOGRAPHY } from "@/styles/styles";
import { useRouter } from "expo-router";
import { Edit3, HelpCircle, Info, LogOut, ShieldCheck, UserCircle2 } from 'lucide-react-native';
import { SafeAreaView, ScrollView, Text, TouchableOpacity, View, StyleSheet } from 'react-native'; // Se añadió StyleSheet aquí
import { useAuth } from "../../hooks/useAuth";
import { useState } from 'react'; // Asegúrate de importar useState
import AlertPersonalizado from '@/components/AlertPersonalizado'; // Importar AlertPersonalizado

export default function Perfil() {
  const { session, signOut } = useAuth()
  const router = useRouter();

  // Estados para el AlertPersonalizado
  const [alertaVisible, setAlertaVisible] = useState(false);
  const [alertaMensaje, setAlertaMensaje] = useState('');
  const [alertaTipo, setAlertaTipo] = useState<'exito' | 'error' | 'info'>('info');

  const handleSignOut = async () => {
    try {
      await signOut();
      setAlertaMensaje('Has cerrado sesión correctamente');
      setAlertaTipo('exito');
      setAlertaVisible(true);
      router.replace('/auth/login');
    } catch (e: any) {
      setAlertaMensaje(e.message || 'No se pudo cerrar sesión');
      setAlertaTipo('error');
      setAlertaVisible(true);
    }
  }

  const userName = session?.user?.user_metadata?.nombre;
  const userLastName = session?.user?.user_metadata?.apellidos;
  const userFullName = userName && userLastName ? `${userName} ${userLastName}` : userName || "Usuario";

  const menuOptions = [
    { title: "Editar Perfil", icon: <Edit3 size={24} color={colors.primary} />, onPress: () => { setAlertaMensaje("Próximamente..."); setAlertaTipo('info'); setAlertaVisible(true); } },
    { title: "Seguridad", icon: <ShieldCheck size={24} color={colors.primary} />, onPress: () => { setAlertaMensaje("Próximamente..."); setAlertaTipo('info'); setAlertaVisible(true); } },
    { title: "Ayuda y Soporte", icon: <HelpCircle size={24} color={colors.primary} />, onPress: () => { setAlertaMensaje("Próximamente..."); setAlertaTipo('info'); setAlertaVisible(true); } },
    { title: "Acerca de", icon: <Info size={24} color={colors.primary} />, onPress: () => { setAlertaMensaje("BiteStack v1.0"); setAlertaTipo('info'); setAlertaVisible(true); } },
    // Se elimina Cerrar Sesión de aquí para volver a ponerlo como un botón separado
  ];

  return (
    <>
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          {session ? (
            <View style={styles.container}>
              <View style={styles.profileHeader}>
                <UserCircle2 size={80} color={colors.primary} strokeWidth={1.5} />
                <Text style={styles.userName}>{userFullName}</Text>
                <Text style={styles.emailText}>{session.user.email}</Text>
              </View>

              <View style={styles.optionsContainer}>
                {menuOptions.map((option, index) => (
                  <TouchableOpacity key={index} style={styles.optionButton} onPress={option.onPress}>
                    {option.icon}
                    <Text style={styles.optionText}>{option.title}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity
                style={styles.logoutButton} // Asegúrate que este estilo exista y sea el que deseas
                onPress={handleSignOut}
              >
                <LogOut size={20} color={colors.white} style={{marginRight: spacing.sm}} />
                <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.authContainer}>
              <UserCircle2 size={80} color={colors.gray} strokeWidth={1.5} />
              <Text style={styles.infoText}>Necesitas iniciar sesión para ver tu perfil y acceder a todas las funcionalidades.</Text>
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

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },
  container: {
    flex: 1, 
    alignItems: "center",
    padding: spacing.xl,
    backgroundColor: colors.white,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: spacing.xxl,
    marginTop: spacing.xxl, // Aumentado el marginTop
  },
  userName: {
    fontSize: TYPOGRAPHY.h2,
    fontWeight: 'bold',
    color: colors.black,
    marginTop: spacing.md,
  },
  emailText: {
    fontSize: TYPOGRAPHY.body1,
    color: colors.gray,
    marginTop: spacing.xs,
  },
  optionsContainer: {
    width: '100%',
    marginBottom: spacing.xl,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.lightGray,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    marginBottom: spacing.md,
  },
  optionText: {
    fontSize: TYPOGRAPHY.body1,
    color: colors.black,
    marginLeft: spacing.md,
  },
  logoutButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: "center",
    backgroundColor: colors.red,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
    borderRadius: radius.md,
    width: '100%',
    marginTop: 'auto',
    marginBottom: spacing.md,
  },
  logoutButtonText: {
    color: colors.white,
    fontSize: TYPOGRAPHY.body1,
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
    fontSize: TYPOGRAPHY.body1,
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
    fontSize: TYPOGRAPHY.body1,
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
    flexGrow: 1,
    justifyContent: 'center',
    paddingBottom: spacing.xl,
  },
});