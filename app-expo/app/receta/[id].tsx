// Archivo: app/receta/[id].tsx
// import React from 'react';
import { View, Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router'; // Para obtener el ID

export default function DetalleRecetaScreen() {
  // Obtiene los parámetros locales de la búsqueda
  // El nombre de la propiedad es 'id' porque el archivo se llama '[id].tsx'
  const { id } = useLocalSearchParams<{ id: string }>();

  // Puedes dejarlo como string o intentar convertirlo a número si lo necesitas después
  const recetaId = id; // O parseInt(id, 10); si quieres el número

  return (
    <View>
      {/* Muestra el ID recibido */}
      <Text>ID de la receta: {recetaId}</Text>
    </View>
  );
}