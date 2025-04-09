import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <>
      <Stack>
        {/* <Stack.Screen name="index" options={{ title: "Home" }} />
        <Stack.Screen name="perfil" options={{ title: "Perfil" }} />
        <Stack.Screen name="lista" options={{ title: "Lista" }} />
        <Stack.Screen name="comidas" options={{ title: "Comidas" }} /> */}

        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
    </>
  );
}
