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
  const getBorderColor = () => {
    switch (tipo) {
      case 'exito':
        return colors.green;
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
        <View style={[styles.modalView, { borderColor: getBorderColor() }]}>
          <Text style={styles.modalText}>{mensaje}</Text>
          <TouchableOpacity
            // Estilo del botón modificado: sin fondo, con borde gris, sin sombra
            style={[
              styles.button,
              {
                backgroundColor: 'transparent',
                borderColor: colors.gray,
                borderWidth: 1,
                elevation: 0,
              },
            ]}
            onPress={onClose}
          >
            {/* Texto del botón oscuro para contraste */}
            <Text style={[styles.textStyle, { color: colors.black }]}>Cerrar</Text>
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
  },
  modalView: {
    marginHorizontal: spacing.xl,
    marginVertical: 20,
    width: '80%',
    backgroundColor: colors.white,
    borderRadius: radius.md,
    padding: spacing.xl,
    alignItems: 'center',
    ...shadow.md,
    borderWidth: 2,
    // borderColor se aplica inline
  },
  button: {
    borderRadius: radius.md, // Consistencia con botones de [id].tsx
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg, // Consistencia
    elevation: 2,
    minWidth: 100, // Consistencia
    alignItems: 'center', // Consistencia
    marginTop: spacing.lg, // Usar constante de espaciado
  },
  textStyle: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    color: colors.black,
    fontSize: 16,
  },
});

export default AlertPersonalizado;
