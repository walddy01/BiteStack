// import React from 'react';
import { View, Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function DetalleRecetaScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const recetaId = parseInt(id, 10);

  return (
    <View>
      <Text>ID de la receta: {recetaId}</Text>
    </View>
  );
}