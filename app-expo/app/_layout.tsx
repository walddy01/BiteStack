import React, { useEffect, useCallback, useState } from "react";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useAuth } from "../hooks/useAuth";

// Evita que el splash se oculte automáticamente
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { session, cargando } = useAuth();
  const [appIsReady, setAppIsReady] = useState(false);

  // Cuando la autenticación termine, marcamos la app como lista
  useEffect(() => {
    if (!cargando) {
      setAppIsReady(true);
    }
  }, [cargando]);

  // Oculta el splash sólo cuando estamos listos
  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  // Mientras no estemos listos, no renderizamos nada (manteniendo el splash)
  if (!appIsReady || cargando) {
    return null;
  }

  // Oculta el splash
  onLayoutRootView();

  // Solo permite ver login si NO hay sesión
  return (
    <Stack>
      {session ? (
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      ) : (
        <Stack.Screen name="auth/login" options={{ headerShown: false, title: "Login" }} />
      )}
      <Stack.Screen name="receta/[id]" options={{ headerShown: false, title: "Receta" }} />
      <Stack.Screen name="auth/registro" options={{ headerShown: false, title: "Registro" }} />
      <Stack.Screen name="+not-found" options={{ headerShown: false }} />
    </Stack>
  );
}
