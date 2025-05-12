import React from 'react';
import { Modal, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '../styles/colors';
import { styles as componentStyles } from '../styles/components/AlertPersonalizado.styles';

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
      <View style={componentStyles.centeredView}>
        <View style={[componentStyles.modalView, { borderColor: getBorderColor() }]}>
          <Text style={componentStyles.modalText}>{mensaje}</Text>
          <TouchableOpacity
            style={[
              componentStyles.button,
              {
                backgroundColor: 'transparent',
                borderColor: colors.gray,
                borderWidth: 1,
              },
            ]}
            onPress={onClose}
          >
            <Text style={[componentStyles.buttonText, { color: colors.black }]}>Cerrar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default AlertPersonalizado;
