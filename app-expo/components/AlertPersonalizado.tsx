import React from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '../styles/colors';
import { radius, shadow, spacing } from '../styles/styles'; // Importar spacing, radius y shadow

interface AlertPersonalizadoProps {
  visible: boolean;
  mensaje: string;
  tipo?: 'exito' | 'error' | 'info';
  onClose: () => void;
}

const AlertPersonalizado: React.FC<AlertPersonalizadoProps> = ({ visible, mensaje, tipo = 'info', onClose }) => {
  const getBackgroundColor = () => {
    switch (tipo) {
      case 'exito':
        return colors.green; // Define colors.green en tu archivo de colores
      case 'error':
        return colors.red;
      default:
        return colors.primary;
    }
  };

  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={[styles.modalView, { backgroundColor: getBackgroundColor() }]}>
          <Text style={styles.modalText}>{mensaje}</Text>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: colors.white }]}
            onPress={onClose}
          >
            <Text style={[styles.textStyle, { color: getBackgroundColor() }]}>Cerrar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(250, 250, 250, 0.85)', // Velo blanco translúcido restaurado
  },
  modalView: {
    marginHorizontal: spacing.xl,
    marginVertical: 20, // Mantener o ajustar según preferencia
    width: '80%', // Mantener si se desea un ancho fijo, o quitar para que se ajuste al contenido con el padding
    backgroundColor: colors.lighterGray, // Color base, el específico se aplica inline
    borderRadius: radius.md,
    padding: spacing.xl,
    alignItems: 'center',
    ...shadow.md, // Aplicar el estilo de sombra de la app
    // Se eliminan borderWidth y borderColor personalizados
  },
  button: {
    borderRadius: radius.lg, // Usar radius.lg para consistencia con otros botones
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm, // Ajustar padding vertical
    elevation: 2, // Mantener o ajustar según shadow.md si es necesario
    marginTop: 15,
  },
  textStyle: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    color: colors.white,
    fontSize: 16,
  },
});

export default AlertPersonalizado;
